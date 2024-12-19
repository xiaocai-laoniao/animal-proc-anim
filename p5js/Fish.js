class Fish {
    constructor(origin) {
        // 12段，前10段用于身体，后2段用于尾鳍
        this.spine = new Chain(origin, 12, 64, PI/8);
        this.bodyColor = color(58, 124, 165);
        this.finColor = color(129, 195, 215);
        // 鱼在每个脊椎处的宽度
        this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];
    }

    resolve() {
        let headPos = this.spine.joints[0];
        let mousePos = createVector(mouseX, mouseY);
        let targetPos = p5.Vector.add(headPos, 
            p5.Vector.sub(mousePos, headPos).setMag(16));
        this.spine.resolve(targetPos);
    }

    display() {
        strokeWeight(4);
        stroke(255);
        fill(this.finColor);

        // 使用简短标签以减少代码长度
        let j = this.spine.joints;
        let a = this.spine.angles;

        // 计算相对角度差用于背鳍的计算
        let headToMid1 = relativeAngleDiff(a[0], a[6]);
        let headToMid2 = relativeAngleDiff(a[0], a[7]);
        let headToTail = headToMid1 + relativeAngleDiff(a[6], a[11]);

        // === 胸鳍 ===
        push();
        translate(this.getPosX(3, PI/3, 0), this.getPosY(3, PI/3, 0));
        rotate(a[2] - PI/4);
        ellipse(0, 0, 160, 64); // 右
        pop();
        push();
        translate(this.getPosX(3, -PI/3, 0), this.getPosY(3, -PI/3, 0));
        rotate(a[2] + PI/4);
        ellipse(0, 0, 160, 64); // 左
        pop();

        // === 腹鳍 ===
        push();
        translate(this.getPosX(7, PI/2, 0), this.getPosY(7, PI/2, 0));
        rotate(a[6] - PI/4);
        ellipse(0, 0, 96, 32); // 右
        pop();
        push();
        translate(this.getPosX(7, -PI/2, 0), this.getPosY(7, -PI/2, 0));
        rotate(a[6] + PI/4);
        ellipse(0, 0, 96, 32); // 左
        pop();

        // === 尾鳍 ===
        beginShape();
        for (let i = 8; i < 12; i++) {
            let tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
            curveVertex(
                j[i].x + cos(a[i] - PI/2) * tailWidth, 
                j[i].y + sin(a[i] - PI/2) * tailWidth
            );
        }
        for (let i = 11; i >= 8; i--) {
            let tailWidth = max(-13, min(13, headToTail * 6));
            curveVertex(
                j[i].x + cos(a[i] + PI/2) * tailWidth, 
                j[i].y + sin(a[i] + PI/2) * tailWidth
            );
        }
        endShape(CLOSE);

        fill(this.bodyColor);

        // === 身体 ===
        beginShape();
        for (let i = 0; i < 10; i++) {
            curveVertex(this.getPosX(i, PI/2, 0), this.getPosY(i, PI/2, 0));
        }
        curveVertex(this.getPosX(9, PI, 0), this.getPosY(9, PI, 0));
        for (let i = 9; i >= 0; i--) {
            curveVertex(this.getPosX(i, -PI/2, 0), this.getPosY(i, -PI/2, 0));
        }
        curveVertex(this.getPosX(0, -PI/6, 0), this.getPosY(0, -PI/6, 0));
        curveVertex(this.getPosX(0, 0, 4), this.getPosY(0, 0, 4));
        curveVertex(this.getPosX(0, PI/6, 0), this.getPosY(0, PI/6, 0));
        curveVertex(this.getPosX(0, PI/2, 0), this.getPosY(0, PI/2, 0));
        curveVertex(this.getPosX(1, PI/2, 0), this.getPosY(1, PI/2, 0));
        curveVertex(this.getPosX(2, PI/2, 0), this.getPosY(2, PI/2, 0));
        endShape(CLOSE);

        fill(this.finColor);

        // === 背鳍 ===
        beginShape();
        vertex(j[4].x, j[4].y);
        bezierVertex(
            j[5].x, j[5].y, 
            j[6].x, j[6].y, 
            j[7].x, j[7].y
        );
        bezierVertex(
            j[6].x + cos(a[6] + PI/2) * headToMid2 * 16,
            j[6].y + sin(a[6] + PI/2) * headToMid2 * 16,
            j[5].x + cos(a[5] + PI/2) * headToMid1 * 16,
            j[5].y + sin(a[5] + PI/2) * headToMid1 * 16,
            j[4].x, j[4].y
        );
        endShape();

        // === 眼睛 ===
        fill(255);
        ellipse(this.getPosX(0, PI/2, -18), this.getPosY(0, PI/2, -18), 24, 24);
        ellipse(this.getPosX(0, -PI/2, -18), this.getPosY(0, -PI/2, -18), 24, 24);
    }

    debugDisplay() {
        this.spine.display();
    }

    getPosX(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].x + 
            cos(this.spine.angles[i] + angleOffset) * 
            (this.bodyWidth[i] + lengthOffset);
    }

    getPosY(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].y + 
            sin(this.spine.angles[i] + angleOffset) * 
            (this.bodyWidth[i] + lengthOffset);
    }
} 