//console.log("It works");
//world > object that contains all of our shapes
//engine > reads the state of the world, change position of the shapes
//runner > gets the engine and world to work together
//render > takes the data and shows shapes on the screen
//body > A shape we are displaying

//Destructure objects from matter.js
//Boilerplate
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

const width = 800;
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
        wireframes: false,
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Add mouse interactivity
World.add(
    world, 
    MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
})
);

//First two coordinates = distance center of shape from origin
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//     //does the shap move?
//     isStatic: true
// });
// World.add(world, shape);

//Walls
const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true}),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true}),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true}),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true})
]

World.add(world, walls);

//Random Shapes
for (let i = 0; i < 30; i++) {
    if (Math.random() < 0.5) {
      World.add(
        world,
        Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    );  
    } else {
        World.add(
            world,
            Bodies.circle(Math.random() * width, Math.random() * height, 35, {
                render: {
                    fillStyle: "pink",
                }
            })
        )
    } 
}

//Building a maze
//Create cells
//Pick a random cell
//Build a list of neighbours
//If a neighbour has been visited before, remove it from the list
//For each remaining neighbour "move" to it and remove the walls
//Repeat for new neighbour

