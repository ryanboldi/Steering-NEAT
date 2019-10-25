const WIDTH = 800;
const HEIGHT = 800;
const MAX_DIST = Math.sqrt(800 ** 2 + 600 ** 2); //max euclidian distance

const BALL_RADIUS = 10; //radius of ball creatures
const BALL_START = BALL_RADIUS * 2; // y value that balls should start at
const BALL_SIGHT = 60;
const BALL_STEER_SENS = 15;

const BALL_SPEED = 8;
const TURN_PENALTY = 0;
const DEATH_PENALTY = 10;

const DEATHWALL = true;
let DEATHWALL_SPEED = 1;

const EYE_ANGLE = 45;

//const BALL_ALIVE_SCORE = 0.1; //score per frame for being alive.
//const BALLS = 100;

let win;
let counter = 0;

const WALL_SPACING = BALL_SIGHT / 2;
const WALL_PRESET = "maze"; //random or maze or blocks

let balls = [];
let walls = [];

let deathSlider;
let ApplyButton;

function setup() {
    deathSlider = createSlider(0, 2, DEATHWALL_SPEED);
    deathSlider.position(WIDTH + 50, 50);

    if (DEATHWALL) {
        walls.push(new Wall(0, -60, WIDTH, 3));
    }
    walls.push(new Wall(WIDTH - 1, 0, 10, HEIGHT));
    walls.push(new Wall(0, -10, WIDTH, 10));
    walls.push(new Wall(-10, 0, 10, HEIGHT));
    walls.push(new Wall(0, HEIGHT - 1, WIDTH, 10));

    win = createVector(100, HEIGHT - 50); //GOAL POSITION
    angleMode(DEGREES);
    createCanvas(WIDTH, HEIGHT);
    background(230);
    //walls.push(new Wall(100,100,100,50));
    //walls.push(new Wall(random(200, 600), random(200, 400), random(0, 400), random(0, 200)));
    if (WALL_PRESET == "random") {
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

    if (WALL_PRESET == "maze") {
        walls.push(new Wall(0, 200, 50, HEIGHT));
        walls.push(new Wall(50, 200, 400, 25));
        walls.push(new Wall(400, 300, 400, 25));
        walls.push(new Wall(50, 400, 400, 25));
        walls.push(new Wall(400, 500, 400, 25));
        walls.push(new Wall(50, 600, 400, 25));
        walls.push(new Wall(400, 700, 400, 25));
        walls.push(new Wall(750, 200, 50, HEIGHT));
    }

    if (WALL_PRESET == "blocks") {
        walls.push(new Wall(0, 150, 250, 25));
        walls.push(new Wall(550, 150, 250, 25));
        walls.push(new Wall(225, 280, 300, 25));
        walls.push(new Wall(0, 400, 300, 25));
        walls.push(new Wall(500, 400, 300, 25));
    }

   var ApplyButton = createButton("Apply Changes");
   ApplyButton.mousePressed(ApplyChanges); 
    ApplyChanges(); 
    textSize(24);
}

function draw() {
    background(230);
    fill(0);
    text(`Generation ${neat.generation}`, width-230, 50);
    text(`Generation best ${neat.getFittest().score}`, width-230, 80);
    counter++;
    fill(0, 255, 0);
    ellipse(win.x, win.y, 10, 10);
    //win circle

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

    for (let i = 0; i < walls.length; i++) {
        walls[i].show(i);
    }

    if (DEATHWALL) {
        //MOVES DEATHWALL
        walls[0].y += DEATHWALL_SPEED;

    }
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

function normalise(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//applies slider changes and restarts the sketch.
function ApplyChanges(){
    DEATHWALL_SPEED = deathSlider.value();

    console.clear();
    initNeat();
    startEvaluation();
}