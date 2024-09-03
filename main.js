const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let widthBlock = 15;
let heightBlock = 7;

let widthUnit = innerWidth / (widthBlock + 1);
let heightUnit = innerHeight / (heightBlock + 1);

let dots = [];

let lines = {
    horizontal: [],
    vertical: [],
};

let selectLines = [];

let boxes = [];

class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(d1, d2, side) {
        this.dot1 = d1;
        this.dot2 = d2;
        this.side = side;
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

        this.state = [this.topSel, this.rightSel, this.bottomSel, this.leftSel];
    }
    draw() {
        if (this.topSel && this.rightSel && this.bottomSel && this.leftSel) {
            ctx.fillStyle = "rgb(0 , 0 , 0)";
            ctx.fillRect(this.startX, this.startY, widthUnit, heightUnit);
        }
    }
}

class bot {
    constructor() {
        this.veryGoodMove = [];
        this.goodMoves = [];
        this.badMoves = [];
    }
    calculate() {
        let lst = { horizontal: [], vertical: [] };
        for (let i = 0; i < lines.horizontal.length; i++) {
            for (let j = 0; j < lines.horizontal[i].length; j++) {
                lst.horizontal.push(lines.horizontal[i][j]);
            }
        }
        for (let i = 0; i < lines.vertical.length; i++) {
            for (let j = 0; j < lines.vertical[i].length; j++) {
                lst.vertical.push(lines.vertical[i][j]);
            }
        }

        for (let line of lst.horizontal) {
            let twoBox = this.check(lst[index]);

            let boxState = [0, 0];

            for (let i = 0; i < 2; i++) {
                for (let state of twoBox[i].state) {
                    if (state) {
                        boxState[i]++;
                    }
                }
            }
            if (boxState[0] < 3 && boxState[1] < 3) {
                this.goodMoves.push(line);
            } else {
                this.badMoves.push(line);
            }

            for (let line of lst.vertical) {
                let twoBox = this.check(lst[index]);

                let boxState = [0, 0];

                for (let i = 0; i < 2; i++) {
                    for (let state of twoBox[i].state) {
                        if (state) {
                            boxState[i]++;
                        }
                    }
                }
                if (boxState[0] == 3 || boxState[1] == 3) {
                    this.veryGoodMoves.push(line);
                } else if (boxState[0] == 2 || boxState[1] == 2) {
                    this.badMoves.push(line);
                } else if (boxState[0] == 1 || boxState[1] == 1) {
                    this.goodMoves.push(line);
                }
            }
        }
    }
    check(line) {
        for (let i = 0; i < boxes.length; i++) {
            for (let j = 0; j < boxes[i].length; j++) {
                for (let k = 0; k < 4; k++) {
                    if (boxes[i][j].lines[k] == line) {
                        if (line.side == "vertical") {
                            return boxes[i][j], boxes[i][j + 1];
                        } else {
                            return [boxes[i][j], boxes[i + 1][j]];
                        }
                    }
                }
            }
        }
    }

    choose() {
        if (this.verGoodMoves != []) {
            var line = Math.floor(Math.random() * (this.veryGoodMoves.length - 1));
        } else {
            if (this.goodMoves != []) {
                var line = Math.floor(Math.random() * (this.goodMoves.length - 1));
            } else {
                var line = Math.floor(Math.random() * (this.badMoves.length - 1));
            }
        }
        return line;
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

    for (let i = 0; i < dots.length; i++) {
        let hlst = [];
        for (let j = 0; j < dots[i].length - 1; j++) {
            hlst.push(new Line(dots[i][j], dots[i][j + 1], "horizontal"));
        }
        lines.horizontal.push(hlst);

        let vlst = [];
        if (i != dots.length - 1) {
            for (let j = 0; j < dots[i].length; j++) {
                vlst.push(new Line(dots[i][j], dots[i + 1][j], "vertical"));
            }
            lines.vertical.push(vlst);
        }
    }

    for (let i = 0; i < lines.horizontal.length - 1; i++) {
        let lst = [];
        for (let j = 0; j < lines.horizontal[i].length; j++) {
            var box = new Box(lines.horizontal[i][j].dot1.x, lines.horizontal[i][j].dot1.y, lines.horizontal[i][j], lines.vertical[i][j + 1], lines.horizontal[i + 1][j], lines.vertical[i][j]);
            lst.push(box);
        }
        boxes.push(lst);
    }
}
createDots();

let lineShouldShow = {
    dot1: dots[parseInt(heightBlock / 2)][parseInt(widthBlock / 2)],
    dot2: dots[parseInt(heightBlock / 2) + 1][parseInt(widthBlock / 2)],
};

addEventListener("mousemove", (event) => {
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

addEventListener("mousedown", (event) => {
    if (lineShouldShow.dot1.x == lineShouldShow.dot2.x) {
        selectLines.push(new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "vertical"));
        for (let i = 0; i < lines.vertical.length; i++) {
            for (let j = 0; j < lines.vertical[i].length; j++) {
                if (
                    (lines.vertical[i][j].dot1 == lineShouldShow.dot1 && lines.vertical[i][j].dot2 == lineShouldShow.dot2) ||
                    (lines.vertical[i][j].dot1 == lineShouldShow.dot2 && lines.vertical[i][j].dot2 == lineShouldShow.dot1)
                ) {
                    lines.vertical[i].splice(j, 1);
                    break;
                }
            }
        }
    } else {
        selectLines.push(new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "horizontal"));
        for (let i = 0; i < lines.horizontal.length; i++) {
            for (let j = 0; j < lines.horizontal[i].length; j++) {
                if (
                    (lines.horizontal[i][j].dot1 == lineShouldShow.dot1 && lines.horizontal[i][j].dot2 == lineShouldShow.dot2) ||
                    (lines.horizontal[i][j].dot1 == lineShouldShow.dot2 && lines.horizontal[i][j].dot2 == lineShouldShow.dot1)
                ) {
                    lines.horizontal[i].splice(j, 1);
                    break;
                }
            }
        }
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
    console.log(lines);
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

    selectLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.dot1.x, line.dot1.y);
        ctx.lineTo(line.dot2.x, line.dot2.y);
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
