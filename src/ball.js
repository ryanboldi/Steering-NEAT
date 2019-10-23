class Ball {
    constructor(genome) {
        this.brain = genome;
        this.brain.score = 0;
        this.bestDist = 0;
        this.turns = 0;

        this.r = BALL_RADIUS;
        var padding = this.r; // stops balls spawning too close to the edge
        //this.pos = createVector(random(padding, WIDTH - padding), BALL_START); //puts ball at random x
        this.pos = createVector(WIDTH / 2, BALL_START);
        this.vel = createVector(BALL_SPEED, 0);
        //this.vel.rotate(random(0,360));

        this.sight = [0, 0, 0]; //each eye is not seeing anything
        this.eyeTips = []; //REAL coords of tips of eyes

        this.alive = true;
        this.aliveCounter = 0;
        balls.push(this);
    }

    show() {
        if (this.alive) {
            this.aliveCounter++;
        }
        push();
        translate(this.pos.x, this.pos.y);
        let moved = [this.pos.x, this.pos.y];
        rotate(this.vel.heading());
        let rotated = this.vel.heading();
        fill(0,0,0,10);
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
            line(0, 0, cos(EYE_ANGLE) * BALL_SIGHT, sin(EYE_ANGLE) * BALL_SIGHT); //left
        } else {
            stroke(0, 255, 0);
            line(0, 0, cos(EYE_ANGLE) * BALL_SIGHT, sin(EYE_ANGLE) * BALL_SIGHT); //left
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
            line(0, 0, cos(EYE_ANGLE) * BALL_SIGHT, -sin(EYE_ANGLE) * BALL_SIGHT); //right
        } else {
            stroke(0, 255, 0);
            line(0, 0, cos(EYE_ANGLE) * BALL_SIGHT, -sin(EYE_ANGLE) * BALL_SIGHT); //right
        }
        //noStroke();
        //fill(0, 0, 255);
        // ellipse(BALL_SIGHT, 0, 10, 10);
        // ellipse(cos(45) * BALL_SIGHT, sin(45) * BALL_SIGHT, 10, 10);
        // ellipse(cos(45) * BALL_SIGHT, -sin(45) * BALL_SIGHT, 10, 10);
        pop();


        // v ARRAY to store all the REAL coordinates of the eye tips
        this.eyeTips = [
            localToReal(cos(EYE_ANGLE) * BALL_SIGHT, sin(EYE_ANGLE) * BALL_SIGHT, moved, rotated),
            localToReal(BALL_SIGHT, 0, moved, rotated),
            localToReal(cos(EYE_ANGLE) * BALL_SIGHT, -sin(EYE_ANGLE) * BALL_SIGHT, moved, rotated)
        ];

        this.update();
    }
    update() {
        //updates physics of ball called once per frame
        if (this.alive) {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            let input = [this.sight[0], this.sight[1], this.sight[2], normalise(this.vel.angleBetween(createVector(win.x - this.pos.x, win.y - this.pos.y)), 0, 360, 0, 1)];
            let output = this.brain.activate(input);

            //console.log(output);

            if (output[0] > 0.5 && output[0] > output[1]) {
                this.turns ++;
                this.vel.rotate(BALL_STEER_SENS);
            }
            if (output[1] > 0.5) {
                //console.log("LEFT");
                this.turns ++;
                this.vel.rotate(-BALL_STEER_SENS);
            }
            this.checkCollision();
            this.fitness();
        }
        
    }


    checkCollision() {
        walls.forEach(wall => {
            if (collideRectCircle(wall.x, wall.y, wall.w, wall.h, this.pos.x, this.pos.y, this.r)) {
                this.brain.score -= DEATH_PENALTY;
                this.alive = false;
            }
        });
        //sets sight to an array of length 3, one for each eye that is colliding with an obstacle, 0 if not.
        for (let i = 0; i < this.eyeTips.length; i++) {
            //CHECK FOR COLLISION BETWEEN OBSTACLES AND EYETIPS
            walls.forEach(wall => {
                if (collideLineRect(this.pos.x, this.pos.y, this.eyeTips[i].x, this.eyeTips[i].y, wall.x, wall.y, wall.w, wall.h)) {
                    this.setSight(i, 1);
                }
            });
            //checks if collison has stopped to reset eyes to green.
            let stoppedColliding = true;
            walls.forEach(wall => {
                if (collideLineRect(this.pos.x, this.pos.y, this.eyeTips[i].x, this.eyeTips[i].y, wall.x, wall.y, wall.w, wall.h)) {
                    stoppedColliding = false;
                }
            });

            if (stoppedColliding == true) {
                this.setSight(i, 0);
            }
        }
    }

    //console.log(this.sight);
    setSight(i, sight) {
        this.sight[i] = sight;
    }

    fitness() {
        let DIST = dist(this.pos.x, this.pos.y, win.x, win.y);
        let score = int(normalise(DIST, 0, MAX_DIST, 100, 0)); //normalises score so that being close to the goal is 100 score.

        if (score > this.bestDist) {
            this.bestDist = score;
        }

        this.brain.score = this.bestDist - (this.turns * TURN_PENALTY);
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