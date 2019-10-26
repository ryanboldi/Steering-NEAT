const WIDTH = 800; //Width of main canvas
const HEIGHT = 800; //height of main canvas
const MAX_DIST = Math.sqrt(800 ** 2 + 600 ** 2); //max euclidian distance to goal

const BALL_RADIUS = 10; //radius of ball creatures
const BALL_START = BALL_RADIUS * 2; // y value that balls should start at
const BALL_SIGHT = 60; //length of eyes
let BALL_STEER_SENS = 15; //how many degrees a ball can turn per frame.

let BALL_SPEED = 8; //multiplier for the magnitude of ball movement vector
const TURN_PENALTY = 0; //fitness the ball loses per turn
const DEATH_PENALTY = 10; //fitness the ball loses for dying

const DEATHWALL = true; //include DeathWall™ (wall that kills slow creatures)
let DEATHWALL_SPEED = 1; //distance that the wall moves per frame

const EYE_ANGLE = 45; //angle between eyes

//const BALL_ALIVE_SCORE = 0.1; //score per frame for being alive.
//const BALLS = 100;

let win; //vector to hold win position
let counter = 0;

const WALL_SPACING = BALL_SIGHT / 2;
let WALL_PRESET = "Maze"; //random or maze or blocks

let balls = [];
let walls = [];

// global variables for the HTML items.
let deathSlider; 
let deathText;
let ApplyButton;
let presetSelect;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    angleMode(DEGREES);
    background(230);

    //-------------- HTML STUFF
    var ApplyButton = createButton("Reset & Apply Changes");
    ApplyButton.mousePressed(ApplyChanges);
    ApplyButton.position(WIDTH + 50, 400);

    deathSlider = createSlider(0, 20, DEATHWALL_SPEED * 10);
    deathSlider.position(WIDTH + 50, 50);

    deathText = createP("DeathWall™️ Speed");
    deathText.position(deathSlider.x + 150, deathSlider.y - 15);

    mutSlider = createSlider(0, 10, MUTATION_RATE * 10);
    mutSlider.position(WIDTH + 50, deathSlider.y + 30);

    mutText = createP("Mutation Rate");
    mutText.position(mutSlider.x + 150, mutSlider.y - 15);

    popSlider = createSlider(1, 500, PLAYERS);
    popSlider.position(WIDTH + 50, mutSlider.y + 30);

    popText = createP("Population");
    popText.position(popSlider.x + 150, popSlider.y - 15);

    speedSlider = createSlider(1, 20, BALL_SPEED);
    speedSlider.position(WIDTH + 50, popSlider.y + 30);

    speedText = createP("Movement Speed");
    speedText.position(speedSlider.x + 150, speedSlider.y - 15);

    presetSelect = createSelect();
    presetSelect.option('Maze');
    presetSelect.option('Blocks');
    presetSelect.option('Random');
    presetSelect.position(WIDTH + 50, speedSlider.y + 30);

    presetText = createP("Wall Preset");
    presetText.position(presetSelect.x + 150, presetSelect.y - 15);
    //--------------------------------------------------------

    ApplyChanges();
    textSize(24);
}

function draw() {
    //updates all text
    deathText.html(`DeathWall™️ Speed: ${deathSlider.value() / 10}`);
    mutText.html(`Mutation Rate: ${mutSlider.value() / 10}`);
    popText.html(`Population: ${popSlider.value()}`);
    speedText.html(`Movement Speed: ${speedSlider.value()}`);

    background(230);
    fill(0);
    text(`Generation ${neat.generation}`, width - 230, 50);
    text(`Generation best ${neat.getFittest().score}`, width - 230, 80);
    counter++;


    //win circle
    fill(0, 255, 0);
    ellipse(win.x, win.y, 10, 10);
    

    if (counter == ITERATIONS) {
        endEvaluation();
        counter = 0;
    }

    //check if all balls are dead
    let dead = true;
    balls.forEach(ball => {
        if (ball.alive) {
            dead = false;
        }
    });

    //if all dead, reset generation
    if (dead == true) {
        counter = 0;
        endEvaluation();
    }

    //draw all the walls.
    for (let i = 0; i < walls.length; i++) {
        walls[i].show(i);
    }

    if (DEATHWALL) {
        //MOVES DEATHWALL
        walls[0].y += DEATHWALL_SPEED;

    }

    //shows all the balls
    balls.forEach(ball => {
        ball.show();
    });
}

function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        //b.vel.rotate(-BALL_STEER_SENS);
    }
    if (keyCode == RIGHT_ARROW) {
        //b.vel.rotate(BALL_STEER_SENS);
    }
}

//noramlises a value from two numbers to two others.
function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//applies slider changes and restarts the sketch.
function ApplyChanges() {
    walls = [];
    DEATHWALL_SPEED = deathSlider.value() / 10;
    MUTATION_RATE = mutSlider.value() / 10;
    PLAYERS = popSlider.value();
    BALL_SPEED = speedSlider.value();
    BALL_STEER_SENS = BALL_SPEED * 2;
    WALL_PRESET = presetSelect.value();

    //------------------------------------------------------------------------------
    //ADDS WALLS
    if (DEATHWALL) {
        walls.push(new Wall(0, -60, WIDTH, 3));
    }
    walls.push(new Wall(WIDTH - 1, 0, 10, HEIGHT));
    walls.push(new Wall(0, -10, WIDTH, 10));
    walls.push(new Wall(-10, 0, 10, HEIGHT));
    walls.push(new Wall(0, HEIGHT - 1, WIDTH, 10));

    win = createVector(100, HEIGHT - 50); //GOAL POSITION

    //walls.push(new Wall(100,100,100,50));
    //walls.push(new Wall(random(200, 600), random(200, 400), random(0, 400), random(0, 200)));
    if (WALL_PRESET == "Random") {
        while (walls.length < 4 + 4) {
            let testWall = new Wall(random(0, 600), random(200, 400), random(50, 400), random(30, 200));
            let hitting = false;
            walls.forEach(wall => {
                if (collideRectRect(testWall.x, testWall.y, testWall.w, testWall.h, wall.x - WALL_SPACING, wall.y - WALL_SPACING, wall.w + WALL_SPACING * 2, wall.h + WALL_SPACING * 2)) {
                    console.log("respawning");
                    hitting = true;
                }
            });

            if (hitting == false) {
                walls.push(testWall);
            }
        }
    }

    if (WALL_PRESET == "Maze") {
        walls.push(new Wall(0, 200, 50, HEIGHT));
        walls.push(new Wall(50, 200, 400, 25));
        walls.push(new Wall(400, 300, 400, 25));
        walls.push(new Wall(50, 400, 400, 25));
        walls.push(new Wall(400, 500, 400, 25));
        walls.push(new Wall(50, 600, 400, 25));
        walls.push(new Wall(400, 700, 400, 25));
        walls.push(new Wall(750, 200, 50, HEIGHT));
    }

    if (WALL_PRESET == "Blocks") {
        walls.push(new Wall(0, 150, 300, 25));
        walls.push(new Wall(500, 150, 300, 25));

        walls.push(new Wall(200, 300, 400, 25));

        walls.push(new Wall(0, 425, 300, 25));
        walls.push(new Wall(500, 425, 300, 25));

        walls.push(new Wall(200, 575, 400, 25));

        walls.push(new Wall(0, 675, 300, 25));
        walls.push(new Wall(500, 675, 300, 25));
    }
    //-----------------------------------------------------------------------------------
    if (DEATHWALL) {
        walls[0].y = -60;
    }

    console.clear();
    initNeat();
    startEvaluation();
}