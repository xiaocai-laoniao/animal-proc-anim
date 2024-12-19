// 限制向量在锚点的特定范围内
function constrainDistance(pos, anchor, constraint) {
    return p5.Vector.add(anchor, p5.Vector.sub(pos, anchor).setMag(constraint));
}

// 限制角度在锚点的特定范围内
function constrainAngle(angle, anchor, constraint) {
    if (abs(relativeAngleDiff(angle, anchor)) <= constraint) {
        return simplifyAngle(angle);
    }

    if (relativeAngleDiff(angle, anchor) > constraint) {
        return simplifyAngle(anchor - constraint);
    }

    return simplifyAngle(anchor + constraint);
}

// 计算将角度转到锚点需要旋转的弧度
function relativeAngleDiff(angle, anchor) {
    // 由于角度表示为[0, 2pi)范围内的值，将坐标空间旋转使得PI位于锚点处会很有帮助
    // 这样我们就不用担心0和2pi之间的"接缝"
    angle = simplifyAngle(angle + PI - anchor);
    anchor = PI;

    return anchor - angle;
}

// 将角度简化到[0, 2pi)范围内
function simplifyAngle(angle) {
    while (angle >= TWO_PI) {
        angle -= TWO_PI;
    }

    while (angle < 0) {
        angle += TWO_PI;
    }

    return angle;
} 