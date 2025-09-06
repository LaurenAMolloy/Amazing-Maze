//Building a maze
//Create cells
//Pick a random cell
//Build a list of neighbours
//If a neighbour has been visited before, remove it from the list
//For each remaining neighbour "move" to it and remove the walls
//Repeat for new neighbour

const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;

const engine = Engine.create();
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
    Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 40, { isStatic: true}),
    Bodies.rectangle(0, height / 2, 40, height, { isStatic: true}),
    Bodies.rectangle(width, height / 2, 40, height, { isStatic: true})
]

World.add(world, walls);

//Grid array every value is false because we have not visited any square yet

//Create an array for 3 elements
const grid = Array(3).fill(false);

console.log(grid);

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

