// 扭动的小家伙
class Snake {
    constructor(origin) {
        this.spine = new Chain(origin, 48, 64, PI/8);
    }

    resolve() {
        let headPos = this.spine.joints[0];
        let mousePos = createVector(mouseX, mouseY);
        let targetPos = p5.Vector.add(headPos, 
            p5.Vector.sub(mousePos, headPos).setMag(8));
        this.spine.resolve(targetPos);
    }

    display() {
        strokeWeight(4);
        stroke(255);
        fill(172, 57, 49);

        // === 开始绘制身体 ===
        beginShape();

        // 蛇的右半边
        for (let i = 0; i < this.spine.joints.length; i++) {
            curveVertex(this.getPosX(i, PI/2, 0), this.getPosY(i, PI/2, 0));
        }

        // 尾部连接点
        curveVertex(this.getPosX(47, PI, 0), this.getPosY(47, PI, 0));

        // 蛇的左半边
        for (let i = this.spine.joints.length - 1; i >= 0; i--) {
            curveVertex(this.getPosX(i, -PI/2, 0), this.getPosY(i, -PI/2, 0));
        }

        // 头部闭合
        // 注意：这里需要精确匹配Processing的角度
        curveVertex(this.getPosX(0, -PI/6, 0), this.getPosY(0, -PI/6, 0));
        curveVertex(this.getPosX(0, 0, 0), this.getPosY(0, 0, 0));
        curveVertex(this.getPosX(0, PI/6, 0), this.getPosY(0, PI/6, 0));

        // 确保曲线闭合的控制点
        curveVertex(this.getPosX(0, PI/2, 0), this.getPosY(0, PI/2, 0));
        curveVertex(this.getPosX(1, PI/2, 0), this.getPosY(1, PI/2, 0));
        curveVertex(this.getPosX(2, PI/2, 0), this.getPosY(2, PI/2, 0));

        endShape(CLOSE);
        // === 结束绘制身体 ===

        // === 开始绘制眼睛 ===
        fill(255);
        ellipse(this.getPosX(0, PI/2, -18), this.getPosY(0, PI/2, -18), 24, 24);
        ellipse(this.getPosX(0, -PI/2, -18), this.getPosY(0, -PI/2, -18), 24, 24);
        // === 结束绘制眼睛 ===
    }

    debugDisplay() {
        this.spine.display();
    }

    bodyWidth(i) {
        switch(i) {
            case 0:
                return 76;
            case 1:
                return 80;
            default:
                return 64 - i;
        }
    }

    getPosX(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].x + 
            cos(this.spine.angles[i] + angleOffset) * 
            (this.bodyWidth(i) + lengthOffset);
    }

    getPosY(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].y + 
            sin(this.spine.angles[i] + angleOffset) * 
            (this.bodyWidth(i) + lengthOffset);
    }
} 