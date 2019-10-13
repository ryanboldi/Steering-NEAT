const WIDTH = 800;
const HEIGHT = 600;

const BALL_RADIUS = 10; //radius of ball creatures
const BALL_START = 10; // y value that balls should start at
const BALL_SIGHT = 50;



let b;

function setup() {
    angleMode(DEGREES);
    createCanvas(WIDTH, HEIGHT);
    background(230);
    b = new Ball();
}

function draw() {
    background(230);
    b.show();
}

function keyPressed() {
    if (keyCode == ARROW_LEFT) {
        b.rotation += 3;
    }
    if (keyCode == ARROW_RIGHT) {
        b.rotation += -3;
    }
}