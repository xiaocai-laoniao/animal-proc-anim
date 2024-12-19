// 故障般的小家伙
class Lizard {
    constructor(origin) {
        this.spine = new Chain(origin, 14, 64, PI/8);
        this.arms = new Array(4);
        this.armDesired = new Array(4);
        
        // 蜥蜴在每个脊椎处的宽度
        this.bodyWidth = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7];
        
        for (let i = 0; i < this.arms.length; i++) {
            this.arms[i] = new Chain(origin, 3, i < 2 ? 52 : 36);
            this.armDesired[i] = createVector(0, 0);
        }
    }

    resolve() {
        let headPos = this.spine.joints[0];
        let mousePos = createVector(mouseX, mouseY);
        let targetPos = p5.Vector.add(headPos, 
            p5.Vector.sub(mousePos, headPos).setMag(12));
        this.spine.resolve(targetPos);

        for (let i = 0; i < this.arms.length; i++) {
            let side = i % 2 === 0 ? 1 : -1;
            let bodyIndex = i < 2 ? 3 : 7;
            let angle = i < 2 ? PI/4 : PI/3;
            let desiredPos = createVector(
                this.getPosX(bodyIndex, angle * side, 80),
                this.getPosY(bodyIndex, angle * side, 80)
            );
            
            if (p5.Vector.dist(desiredPos, this.armDesired[i]) > 200) {
                this.armDesired[i] = desiredPos;
            }

            this.arms[i].fabrikResolve(
                p5.Vector.lerp(this.arms[i].joints[0], this.armDesired[i], 0.4),
                createVector(
                    this.getPosX(bodyIndex, PI/2 * side, -20),
                    this.getPosY(bodyIndex, PI/2 * side, -20)
                )
            );
        }
    }

    display() {
        // === 开始绘制手臂 ===
        noFill();
        for (let i = 0; i < this.arms.length; i++) {
            let shoulder = this.arms[i].joints[2];
            let foot = this.arms[i].joints[0];
            let elbow = this.arms[i].joints[1];
            // 用一个技巧来修正后腿使其更符合物理
            let para = p5.Vector.sub(foot, shoulder);
            let perp = createVector(-para.y, para.x).setMag(30);
            if (i === 2) {
                elbow = p5.Vector.sub(elbow, perp);
            } else if (i === 3) {
                elbow = p5.Vector.add(elbow, perp);
            }
            strokeWeight(40);
            stroke(255);
            bezier(shoulder.x, shoulder.y, elbow.x, elbow.y, elbow.x, elbow.y, foot.x, foot.y);
            strokeWeight(32);
            stroke(82, 121, 111);
            bezier(shoulder.x, shoulder.y, elbow.x, elbow.y, elbow.x, elbow.y, foot.x, foot.y);
        }
        // === 结束绘制手臂 ===

        strokeWeight(4);
        stroke(255);
        fill(82, 121, 111);

        // === 开始绘制身体 ===
        beginShape();
        
        // 添加额外的控制点来开始曲线
        curveVertex(this.getPosX(0, PI/2, 0), this.getPosY(0, PI/2, 0));
        
        // 蜥蜴的右半边
        for (let i = 0; i < this.spine.joints.length; i++) {
            curveVertex(this.getPosX(i, PI/2, 0), this.getPosY(i, PI/2, 0));
        }

        // 蜥蜴的左半边
        for (let i = this.spine.joints.length - 1; i >= 0; i--) {
            curveVertex(this.getPosX(i, -PI/2, 0), this.getPosY(i, -PI/2, 0));
        }

        // 头部轮廓的绘制（更精确的控制）
        curveVertex(this.getPosX(0, -PI/2, 0), this.getPosY(0, -PI/2, 0));
        curveVertex(this.getPosX(0, -PI/6, -8), this.getPosY(0, -PI/6, -10));
        curveVertex(this.getPosX(0, 0, -6), this.getPosY(0, 0, -4));
        curveVertex(this.getPosX(0, PI/6, -8), this.getPosY(0, PI/6, -10));
        curveVertex(this.getPosX(0, PI/2, 0), this.getPosY(0, PI/2, 0));

        // 添加额外的控制点来平滑闭合
        curveVertex(this.getPosX(0, PI/2, 0), this.getPosY(0, PI/2, 0));
        curveVertex(this.getPosX(1, PI/2, 0), this.getPosY(1, PI/2, 0));

        endShape(CLOSE);
        // === 结束绘制身体 ===

        // === 开始绘制眼睛 ===
        fill(255);
        noStroke();  // 添加这行使眼睛更清晰
        ellipse(this.getPosX(0, 3*PI/5, -7), this.getPosY(0, 3*PI/5, -7), 24, 24);
        ellipse(this.getPosX(0, -3*PI/5, -7), this.getPosY(0, -3*PI/5, -7), 24, 24);
        
        // 添加眼球
        fill(0);
        ellipse(this.getPosX(0, 3*PI/5, -7), this.getPosY(0, 3*PI/5, -7), 12, 12);
        ellipse(this.getPosX(0, -3*PI/5, -7), this.getPosY(0, -3*PI/5, -7), 12, 12);
        // === 结束绘制眼睛 ===
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