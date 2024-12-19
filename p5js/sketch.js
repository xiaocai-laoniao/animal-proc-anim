// 全局变量声明
let fish;
let snake;
let lizard;

// 当前显示的动物
let animal;

function setup() {
    // 创建全屏画布
    createCanvas(windowWidth, windowHeight);
    
    // 初始化动物对象
    fish = new Fish(createVector(width/2, height/2));
    snake = new Snake(createVector(width/2, height/2));
    lizard = new Lizard(createVector(width/2, height/2));
    
    // 初始化当前显示的动物为鱼
    animal = 0;
}

function draw() {
    // 设置背景色 (40, 44, 52 对应Processing中的背景色)
    background(40, 44, 52);
    
    // 根据当前选择更新和显示对应的动物
    switch (animal) {
        case 0:
            fish.resolve();
            fish.display();
            break;
        case 1:
            snake.resolve();
            snake.display();
            break;
        case 2:
            lizard.resolve();
            lizard.display();
            break;
    }
}

// 鼠标点击时切换动物
function mousePressed() {
    if (++animal > 2) {
        animal = 0;
    }
}

// 窗口大小改变时调整画布大小
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}