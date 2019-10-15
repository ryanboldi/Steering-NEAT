class Ball {
    constructor() {
        //this.brain = genome;
        //this.brain.score = 0;
        this.r = BALL_RADIUS;
        var padding = this.r; // stops balls spawning too close to the edge
        this.pos = createVector(random(padding, WIDTH - padding), BALL_START); //puts ball at random x
        this.vel = createVector(1, 0);

        this.sight = [0, 0, 0]; //each eye is not seeing anything
        this.eyeTips = []; //REAL coords of tips of eyes
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        let moved = [this.pos.x, this.pos.y];
        rotate(this.vel.heading());
        let rotated = this.vel.heading();
        fill(0);
        noStroke();
        ellipse(0, 0, this.r, this.r); //draws main circle
        triangle(0, this.r / 1.9, 0, -this.r / 1.9, -this.r * 2, 0); //draws triangle to see direction

        stroke(0, 255, 0);
        strokeWeight(1);
        //draw eyes (x,0), (xcos45,xsin45), (xcos45, -xsin45)

        //console.log(this.sight);
        //draws left eye
        if (this.sight[0] == 1) {
            stroke(255, 0, 0);
            line(0, 0, cos(45) * BALL_SIGHT, sin(45) * BALL_SIGHT); //left
        } else {
            stroke(0, 255, 0);
            line(0, 0, cos(45) * BALL_SIGHT, sin(45) * BALL_SIGHT); //left
        }

        //console.log(this.sight);
        //draws middle eye
        if (this.sight[1] == 1) {
            stroke(255, 0, 0);
            line(0, 0, BALL_SIGHT, 0); //middle eye
        } else {
            stroke(0, 255, 0);
            line(0, 0, BALL_SIGHT, 0); //middle eye
        }

        if (this.sight[2] == 1) {
            stroke(255, 0, 0);
            line(0, 0, cos(45) * BALL_SIGHT, -sin(45) * BALL_SIGHT); //right
        } else {
            stroke(0, 255, 0);
            line(0, 0, cos(45) * BALL_SIGHT, -sin(45) * BALL_SIGHT); //right
        }



        //noStroke();
        //fill(0, 0, 255);
        // ellipse(BALL_SIGHT, 0, 10, 10);
        // ellipse(cos(45) * BALL_SIGHT, sin(45) * BALL_SIGHT, 10, 10);
        // ellipse(cos(45) * BALL_SIGHT, -sin(45) * BALL_SIGHT, 10, 10);
        pop();


        // v ARRAY to store all the REAL coordinates of the eye tips
        this.eyeTips = [
            localToReal(cos(45) * BALL_SIGHT, sin(45) * BALL_SIGHT, moved, rotated),
            localToReal(BALL_SIGHT, 0, moved, rotated),
            localToReal(cos(45) * BALL_SIGHT, -sin(45) * BALL_SIGHT, moved, rotated)
        ];

        this.update();
    }
    update() {
        //updates physics of ball called once per frame
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.checkCollision();
    }

    //sets sight to an array of length 3, one for each eye that is colliding with an obstacle, 0 if not.
    checkCollision() {
        //CHECK FOR COLLISION BETWEEN OBSTACLES AND EYETIPS
        walls.forEach(wall => {
            let lines = wall.getLines();
            //lines.forEach(line => {console.log(line)});
            lines.forEach(line => {
                for (let i = 0; i < 3; i++) {
                    //checks if each eye collides with any line
                    //console.log(this.eyeTips[i].x, this.eyeTips[i].y);
                    if (intersects(this.pos.x, this.pos.y, this.eyeTips[i].x, this.eyeTips[i].y, line[0], line[1], line[2], line[3]) == true) {
                        console.log("INTERSECT");
                    } else if (!intersects(this.pos.x, this.pos.y, this.eyeTips[i].x, this.eyeTips[i].y, line[0], line[1], line[2], line[3])) {
                        this.setSight(i, 0);
                    }

                    //console.log(this.sight);
    setSight(i, sight){
        this.sight[i] = sight;
    }
}

/** 
 * returns a vector
 * converts coords in the local coord system to coords in the real system after reversing transformations/ rotations
 * @param {float} x x coordinate in local
 * @param {float} y y coordinate in local
 * @param {array} moved (x,y) array for x and y transformation
 * @param {float} rotated degrees that that the drawing was rotated
 */
function localToReal(x, y, moved, rotated) {
    let newX = 0;
    let newY = 0;

    //reverse rotation
    //reverse rotation by rotated degrees about (0,0)
    let vec = createVector(x, y).rotate(rotated);
    newX = vec.x;
    newY = vec.y;

    //reverse transform
    newX += moved[0];
    newY += moved[1];

    return createVector(newX, newY)
}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};