const WIDTH = 800;
const HEIGHT = 600;

const BALL_RADIUS = 10; //radius of ball creatures
const BALL_START = 10; // y value that balls should start at
const BALL_SIGHT = 60;
const BALL_STEER_SENS = 3;

const BALL_SPEED = 1;

let b;
let walls = [];


function setup() {
    angleMode(DEGREES);
    createCanvas(WIDTH, HEIGHT);
    background(230);


    b = new Ball();
    //walls.push(new Wall(100,100,100,50));
    walls.push(new Wall(random(200, 600), random(200, 400), random(0, 400), random(0, 200)));
    while (walls.length < 4) {
        let testWall = new Wall(random(200, 600), random(200, 400), random(0, 400), random(0, 200));
        let hitting = false;
        walls.forEach(wall => {
            if (collideRectRect(testWall.x, testWall.y, testWall.w, testWall.h, wall.x, wall.y, wall.w, wall.h)) {
                console.log("respawning");
                hitting = true;
            }
        });

        if (hitting == false){
            walls.push(testWall);
        }
    }
}

function draw() {
    background(230);
    walls.forEach(wall => {
        wall.show();
    });
    b.show();

    if (keyIsDown(LEFT_ARROW)) {
        b.vel.rotate(-BALL_STEER_SENS);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        b.vel.rotate(BALL_STEER_SENS);
    }
}

function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        //b.vel.rotate(-BALL_STEER_SENS);
    }
    if (keyCode == RIGHT_ARROW) {
        //b.vel.rotate(BALL_STEER_SENS);
    }
}