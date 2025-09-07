//Building a maze
//Create cells
//Pick a random cell
//Build a list of neighbours
//If a neighbour has been visited before, remove it from the list
//For each remaining neighbour "move" to it and remove the walls
//Repeat for new neighbour

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = 600;
const height = 600;
//Config variables for grid
const cells = 3

const unitLength = width/cells //200

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    //go and render the representation of world in body
    //additive process
    element : document.body,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: true,
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 4, { isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 4, { isStatic: true}),
    Bodies.rectangle(0, height / 2, 4, height, { isStatic: true}),
    Bodies.rectangle(width, height / 2, 4, height, { isStatic: true})
]

World.add(world, walls);

//Maze Generation
//Fisher Yates Shuffle
const shuffle = (arr) => {
    let counter = arr.length;

    while(counter > 0){
        //Get random number
        const idx = Math.floor(Math.random() * counter);

        //Reduce counter
        counter --;
        
        //temp is equal to arr element at counter
        const temp = arr[counter];
        //swap counter for random idx
        arr[counter] = arr[idx];
        arr[idx] = temp;  
    }
    
    return arr;
};

//Grid array every value is false because we have not visited any square yet
//Create an array for 3 elements
const grid = Array(cells)
.fill(null)
.map(() => Array(cells).fill(false));

const verticals = Array(cells)
.fill(null)
.map(() => Array(cells -1).fill(false));

const horizontals = Array(cells -1)
.fill(null)
.map(() => Array(cells).fill(false));

//console.log(verticals);
//console.log(horizontals);
//console.log(grid);

//This is not the best way to do this
//double nested for loop
// for (let i = 0; i < 3; i++){
//     //push empty array for each row
//     grid.push([]);
//     //fill each row with false three times
//     for (let j = 0; j < 3; j++) {
//         grid[i].push(false);
//     }
// }
// console.log(grid);

//Building the Maze
//Pick a random cell
//0 => 2 => 2

//Random num between 1 and 0
const startRow = (Math.floor(Math.random() * cells));
const startColumn = (Math.floor(Math.random() * cells));

console.log(startRow, startColumn);

//Explore one grid at a time...
const stepThroughCell = (row, column) => {
    //If I have visited cell already return
    if(grid[row] [column]) {
        return;
    }

    //Mark this cell as being visited TRUE
    grid[row][column] = true;

    //Assemble randomly-ordered list of neighbour
    //Above will always be row - 1, same column
    //Right will always be same row, column plus 1
    //Below will always be row + 1, same column
    //Left will always be row, c -1

    //JS does not have a built in function to pick random elements of an array
    //We have to make our own
    const neighbours = shuffle([
        [row -1, column, "up"],
        [row, column + 1, "right"],
        [row + 1, column, "down"],
        [row, column -1, "left"]
    ]);
    //console.log(neighbours);

    //for each neighbour...
    for(let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;

        //See if neighbour is out of bounds
        if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
          //move on to the next neighbour
          continue;  
        }

        //If we have visited that neighbour, continue to next neighbour
        if(grid[nextRow][nextColumn]) {
        continue;
    }
    //Remove walls
    //Moving left or right...the row will always be the same
    //But depending on whether we are going left or right we need to access
    //verticals at 0 or 1
    if(direction === "left"){
        verticals[row][column -1] = true;
    } else if (direction === "right") {
        verticals[row][column] = true;
    } else if (direction === "up"){
        horizontals[row -1][column] = true
    } else if (direction === "down") {
        horizontals[row][column] = true;
    }
    stepThroughCell(nextRow, nextColumn);
}
    //Visit that next call
};

stepThroughCell(startRow, startColumn);

//False wall
//True no wall
horizontals.forEach((row, rowIndex) => {
    //console.log(row);
    row.forEach((open, columnIndex) => {
        if(open === true) {
            return
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2, rowIndex * unitLength + unitLength, 
            unitLength, 20, { isStatic: true }
        );
        World.add(world, wall)
    });
});

verticals.forEach((row, rowIndex) => {
    //console.log(row);
    row.forEach((open, columnIndex) => {
        if(open === true) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength, 
            rowIndex * unitLength + unitLength / 2, 
            20, unitLength, { isStatic: true }
        );
        World.add(world, wall);
    });
});

const goal = Bodies.rectangle(
    //Overall width = width
    //We want to subtract 1/2 unit length
    //width - unitlength/2
    //height - unitlength/2
    //x position center
    width - unitLength / 2,
    //y position center
    height - unitLength /2,
    //width
    unitLength * .7,
    //length
    unitLength * .7,
    {
        isStatic: true,
    }

);
World.add(world, goal);

//Ball
const ball = Bodies.circle (
    unitLength / 2, 
    unitLength / 2,
    unitLength / 4
    );

World.add(world, ball);

document.addEventListener('keydown', e => {
    console.log(e);
    const { x, y } = ball.velocity;
    console.log(x, y)

    if(e.keyCode === 87){
        //console.log("up")
        //create a negative velocity by subtracting 5
        Body.setVelocity(ball, { x, y: y - 5 });
    }
    if(e.keyCode === 68){
        //console.log("right");
        Body.setVelocity(ball, { x: x + 5, y });
    }
    if(e.keyCode === 83){
        //console.log("down");
        Body.setVelocity(ball, { x, y: y + 5 });
    }
    if(e.keyCode === 65){
        //console.log("left");
        Body.setVelocity(ball, { x: x - 5, y });
    }
});

//Win Condition

Events.on(engine, 'collisionStart', e => {
    //One event that matter.js owns
    //After the events handler is called
    //properties are wiped out
    console.log(e);
})