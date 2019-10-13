class Ball {
    constructor() {
        //this.brain = genome;
        //this.brain.score = 0;
        this.r = BALL_RADIUS;
        var padding = this.r; // stops balls spawning too close to the edge
        this.pos = createVector(random(padding, WIDTH - padding), BALL_START); //puts ball at random x
        this.vel = createVector(1, 0);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        fill(0);
        noStroke();
        ellipse(0, 0, this.r, this.r); //draws main circle
        triangle(0, this.r / 1.9, 0, -this.r / 1.9, -this.r * 2, 0); //draws triangle to see direction

        stroke(0,255,0);
        strokeWeight(1);
        //draw eyes (x,0), (xcos45,xsin45), (xcos45, -xsin45)
        line(0, 0, BALL_SIGHT, 0); //middle eye
        line(0, 0, cos(45) * BALL_SIGHT, sin(45) * BALL_SIGHT); 
        line(0,0, cos(45) * BALL_SIGHT, -sin(45) * BALL_SIGHT);
        
        pop();

        
    }
    update() {
        //updates physics of ball called once per frame
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

}