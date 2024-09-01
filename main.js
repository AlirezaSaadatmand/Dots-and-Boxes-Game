const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let widthBlock = 15;
let heightBlock = 7;

let widthUnit = innerWidth / (widthBlock + 1);
let heightUnit = innerHeight / (heightBlock + 1);

let dots = [];

let lines = [];

let boxes = [];

class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(d1, d2, color, side) {
        this.start = d1;
        this.end = d2;
        this.color = color;
        this.side = side;

        if (side == "vertical") {
            this.topRight = false;
            this.topLeft = false;
            this.right = false;
            this.left = false;
            this.bottomRight = false;
            this.bottomLeft = false;
        } else {
            this.top = false;
            this.rightTop = false;
            this.leftTop = false;
            this.bottom = false;
            this.rightBottom = false;
            this.leftBottom = false;
        }
    }
}

class Box {
    constructor(startX, startY, topLine, rightLine, bottomLine, leftLine) {
        this.startX = startX;
        this.startY = startY;

        this.topLine = topLine;
        this.rightLine = rightLine;
        this.bottomLine = bottomLine;
        this.leftLine = leftLine;

        this.lines = [topLine, rightLine, bottomLine, leftLine];

        this.topSel = false;
        this.rightSel = false;
        this.bottomSel = false;
        this.leftSel = false;
    }
    draw() {
        if (this.topSel && this.rightSel && this.bottomSel && this.leftSel) {
            ctx.fillStyle = "rgb(0 , 0 , 0)";
            ctx.fillRect(this.startX, this.startY, widthUnit, heightUnit);
        }
    }
}

function createDots() {
    for (let i = 0; i <= heightBlock; i++) {
        let lst = [];
        for (let j = 0; j <= widthBlock; j++) {
            let x = j * widthUnit + widthUnit / 2;
            let y = i * heightUnit + heightUnit / 2;
            let newDot = new Dot(x, y);
            lst.push(newDot);
        }
        dots.push(lst);
    }

    for (let i = 0; i < dots.length - 1; i++) {
        let lst = [];
        for (let j = 0; j < dots[i].length - 1; j++) {
            let topline = { dot1: dots[i][j], dot2: dots[i][j + 1] };
            let rightline = { dot1: dots[i][j + 1], dot2: dots[i + 1][j + 1] };
            let bottomline = { dot1: dots[i + 1][j + 1], dot2: dots[i + 1][j] };
            let leftline = { dot1: dots[i + 1][j], dot2: dots[i][j] };

            let newBox = new Box(dots[i][j].x, dots[i][j].y, topline, rightline, bottomline, leftline);
            lst.push(newBox);
        }
        boxes.push(lst);
    }
}
createDots();

let lineShouldShow = {
    dot1: dots[parseInt(heightBlock / 2)][parseInt(widthBlock / 2)],
    dot2: dots[parseInt(heightBlock / 2) + 1][parseInt(widthBlock / 2)],
};

window.addEventListener("mousemove", (event) => {
    let lst = [];
    for (let i = 0; i < dots.length; i++) {
        for (let j = 0; j < dots[i].length; j++) {
            lst.push(((event.clientX - dots[i][j].x) ** 2 + (event.clientY - dots[i][j].y) ** 2) ** (1 / 2));
        }
    }
    let dis1 = Math.min(...lst);
    let dis1Index = lst.indexOf(dis1);
    lst[lst.indexOf(dis1)] = 2000;
    let dis2 = Math.min(...lst);
    let dis2Index = lst.indexOf(dis2);
    lineShouldShow.dot1 = dots[parseInt(dis1Index / dots[0].length)][dis1Index % dots[0].length];
    lineShouldShow.dot2 = dots[parseInt(dis2Index / dots[0].length)][dis2Index % dots[0].length];
});

window.addEventListener("mousedown", (event) => {
    if (lineShouldShow.dot1.x == lineShouldShow.dot2.x) {
        lines.push(new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "vertical"));
    } else {
        lines.push(new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "horizontal"));
    }

    for (let row = 0; row < boxes.length; row++) {
        for (let col = 0; col < boxes[row].length; col++) {
            for (let line = 0; line < 4; line++) {
                if (
                    (lineShouldShow.dot1 == boxes[row][col].lines[line].dot1 && lineShouldShow.dot2 == boxes[row][col].lines[line].dot2) ||
                    (lineShouldShow.dot1 == boxes[row][col].lines[line].dot2 && lineShouldShow.dot2 == boxes[row][col].lines[line].dot1)
                ) {
                    if (line == 0) {
                        boxes[row][col].topSel = true;
                        if (row != 0) {
                            boxes[row - 1][col].bottomSel = true;
                        }
                    } else if (line == 1) {
                        boxes[row][col].rightSel = true;
                        if (col != boxes[row].length - 1) {
                            boxes[row][col + 1].leftSel = true;
                        }
                    } else if (line == 2) {
                        boxes[row][col].bottomSel = true;
                        if (row != boxes.length - 1) {
                            boxes[row + 1][col].topSel = true;
                        }
                    } else {
                        boxes[row][col].leftSel = true;
                        if (col != 0) {
                            boxes[row][col - 1].rightSel = true;
                        }
                    }
                    break;
                }
            }
        }
    }
});

function draw() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = 0; j < dots[i].length; j++) {
            ctx.beginPath();
            ctx.arc(dots[i][j].x, dots[i][j].y, 5, 0, Math.PI * 2, false);
            ctx.fillStyle = "black";
            ctx.fill();
        }
    }

    ctx.beginPath();
    ctx.moveTo(lineShouldShow.dot1.x, lineShouldShow.dot1.y);
    ctx.lineTo(lineShouldShow.dot2.x, lineShouldShow.dot2.y);
    ctx.fillStyle = "rgb(0 , 0 , 0)";
    ctx.stroke();

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.fillStyle = line.color;
        ctx.stroke();
    });

    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes[i].length; j++) {
            boxes[i][j].draw();
        }
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(255 , 255 , 255 , 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
}
animate();
