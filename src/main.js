const WIDTH = 800;
const HEIGHT = 600;

const BALL_RADIUS = 5; //radius of ball creatures
const BALL_START = 10; // y value that balls should start at
const BALL_SIGHT = 45;
const BALL_STEER_SENS = 10;

const BALL_SPEED = 5;

const BALL_ALIVE_SCORE = 0; //score per frame for being alive.
//const BALLS = 100;

let win;
let counter = 0;

const WALL_SPACING = BALL_SIGHT / 2;
const WALL_PRESET = "maze"; //random or maze

let balls = [];
let walls = [];


function setup() {
    walls.push(new Wall(WIDTH-1, 0, 10, HEIGHT));
    walls.push(new Wall(0,-10,WIDTH, 10));
    walls.push(new Wall(-10,0, 10, HEIGHT));
    walls.push(new Wall(0, HEIGHT-1, WIDTH, 10));

    win = createVector(200,550);
    angleMode(DEGREES);
    createCanvas(WIDTH, HEIGHT);
    background(230);
    //walls.push(new Wall(100,100,100,50));
    //walls.push(new Wall(random(200, 600), random(200, 400), random(0, 400), random(0, 200)));
    if (WALL_PRESET == "random") {
        while (walls.length < 4+4) {
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
        walls.push(new Wall(0, 200, 100, 500));
        walls.push(new Wall(100, 200, 400, 100));
        walls.push(new Wall(350, 400, 400, 100));
        walls.push(new Wall(750, 200, 50, 400));

    }

    initNeat();
    startEvaluation();
}

function draw() {
    counter++;
    background(230);
    fill(0,255,0);
    ellipse(win.x, win.y, 10,10);
    //win circle

    if (counter == ITERATIONS){
        endEvaluation();
        counter = 0;
    }

    //check if all balls are dead
    let dead = true;
    balls.forEach(ball=>{
        if(ball.alive){
            dead = false;
        }
    });

    //if all dead, reset generation
    if (dead == true){
        counter = 0;
        endEvaluation();
    }
    
    walls.forEach(wall => {
        wall.show();
    });
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
