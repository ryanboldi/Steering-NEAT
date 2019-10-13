class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        fill(0, 255, 255);
        rect(this.x, this.y, this.w, this.h);
    }

    /**
     * Returns array of 4 lines, definied by 2 coords [[x,y,x1,y1],[....]]
     */
    getLines() {
        let lines = [0, 0, 0, 0];
        lines[0] = [this.x, this.y, this.x + this.w, this.y];
        lines[1] = [this.x, this.y + this.h, this.x + this.w, this.y + this.h];
        lines[2] = [this.x , this.y, this.x, this.y + this.h];
        lines[3] = [this.x + this.w, this.y,this.x + this.w, this.y + this.h];

        return lines;
    }
}