const WIDTH = 800;
const HEIGHT = 600;

const BALL_RADIUS = 10; //radius of ball creatures
const BALL_START = 10; // y value that balls should start at
const BALL_SIGHT = 50;
const BALL_STEER_SENS = 30;

let b;
let walls = [];


function setup() {
    angleMode(DEGREES);
    createCanvas(WIDTH, HEIGHT);
    background(230);

    //walls.push(new Wall(100,100,100,50));
    walls.push(new Wall(300,300,100,100));

    b = new Ball();
    
}

function draw() {
    background(230);
    walls.forEach(wall => {
        wall.show();
    });
    b.show();
}

function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        b.vel.rotate(-BALL_STEER_SENS);
    }
    if (keyCode == RIGHT_ARROW) {
        b.vel.rotate(BALL_STEER_SENS);
    }
}