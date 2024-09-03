const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let widthBlock = 10;
let heightBlock = 5;

let widthUnit = innerWidth / (widthBlock + 1);
let heightUnit = innerHeight / (heightBlock + 1);

let dots = [];

let lines = {
    horizontal: [],
    vertical: [],
};

let selectLines = [];
let botSelectedLines = [];

let boxes = [];

let turn = "player";

class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(d1, d2, side, color) {
        this.dot1 = d1;
        this.dot2 = d2;
        this.side = side;
        this.color = color;
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

        this.lastChage = "";
    }
    update() {
        this.state = [this.topSel, this.rightSel, this.bottomSel, this.leftSel];
    }
    draw() {
        if (this.topSel && this.rightSel && this.bottomSel && this.leftSel) {
            if (this.lastChage == "player") {
                ctx.fillStyle = "rgb(0 , 0 , 0)";
            } else {
                ctx.fillStyle = "rgb(255 , 0 , 0)";
            }
            ctx.fillRect(this.startX, this.startY, widthUnit, heightUnit);
        }
    }
}

class Bot {
    constructor() {
        this.veryGoodMoves = [];
        this.goodMoves = [];
        this.badMoves = [];
    }
    calculate() {
        this.veryGoodMoves = [];
        this.goodMoves = [];
        this.badMoves = [];
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

        // horisontal
        for (let line of lst.horizontal) {
            let twoBox = this.check(line);
            if (twoBox.length == 2) {
                let boxState = [0, 0];

                for (let i = 0; i < 2; i++) {
                    for (let stat of twoBox[i].state) {
                        if (stat) {
                            boxState[i] = boxState[i] + 1;
                        }
                    }
                }
                if (boxState[0] == 3 || boxState[1] == 3) {
                    this.veryGoodMoves.push(line);
                } else if (boxState[0] == 2 || boxState[1] == 2) {
                    this.badMoves.push(line);
                } else {
                    this.goodMoves.push(line);
                }
            } else {
                let boxState = [0];

                for (let i = 0; i < 1; i++) {
                    for (let j = 0; j < twoBox[i].state.length; j++) {
                        if (twoBox[i].state[j]) {
                            boxState[i] = boxState[i] + 1;
                        }
                    }
                }
                if (boxState[0] == 3) {
                    this.veryGoodMoves.push(line);
                } else if (boxState[0] == 2) {
                    this.badMoves.push(line);
                } else {
                    this.goodMoves.push(line);
                }
            }
        }
        // vertical
        for (let line of lst.vertical) {
            let twoBox = this.check(line);
            if (twoBox.length == 2) {
                let boxState = [0, 0];

                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < twoBox[i].state.length; j++) {
                        if (twoBox[i].state[j]) {
                            boxState[i] = boxState[i] + 1;
                        }
                    }
                }
                if (boxState[0] == 3 || boxState[1] == 3) {
                    this.veryGoodMoves.push(line);
                } else if (boxState[0] == 2 || boxState[1] == 2) {
                    this.badMoves.push(line);
                } else {
                    this.goodMoves.push(line);
                }
            } else {
                let boxState = [0];

                for (let i = 0; i < 1; i++) {
                    for (let j = 0; j < twoBox[i].state.length; j++) {
                        if (twoBox[i].state[j]) {
                            boxState[i] = boxState[i] + 1;
                        }
                    }
                }
                if (boxState[0] == 3) {
                    this.veryGoodMoves.push(line);
                } else if (boxState[0] == 2) {
                    this.badMoves.push(line);
                } else {
                    this.goodMoves.push(line);
                }
            }
        }
        return this.choose();
    }
    check(line) {
        for (let i = 0; i < boxes.length; i++) {
            for (let j = 0; j < boxes[i].length; j++) {
                for (let k = 0; k < 4; k++) {
                    if (boxes[i][j].lines[k] == line) {
                        if (line.side == "vertical") {
                            if (j == 0) {
                                return [boxes[i][j]];
                            } else if (j != boxes[i].length - 1) {
                                return [boxes[i][j], boxes[i][j + 1]];
                            } else {
                                return [boxes[i][j]];
                            }
                        } else {
                            if (i == 0) {
                                return [boxes[i][j]];
                            } else if (i != boxes.length - 1) {
                                return [boxes[i][j], boxes[i + 1][j]];
                            } else {
                                return [boxes[i][j]];
                            }
                        }
                    }
                }
            }
        }
    }

    choose() {
        // console.log(this.veryGoodMoves, this.goodMoves, this.badMoves);
        if (this.veryGoodMoves.length != 0) {
            let index = Math.floor(Math.random() * this.veryGoodMoves.length);
            return [this.veryGoodMoves[index], "verygood"];
        } else {
            if (this.goodMoves.length != 0) {
                let index = Math.floor(Math.random() * this.goodMoves.length);
                return [this.goodMoves[index], "good"];
            } else {
                let index = Math.floor(Math.random() * this.badMoves.length);
                return [this.badMoves[index], "bad"];
            }
        }
    }
}

let bot = new Bot();

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
            hlst.push(new Line(dots[i][j], dots[i][j + 1], "horizontal", "white"));
        }
        lines.horizontal.push(hlst);

        let vlst = [];
        if (i != dots.length - 1) {
            for (let j = 0; j < dots[i].length; j++) {
                vlst.push(new Line(dots[i][j], dots[i + 1][j], "vertical", "white"));
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

function fixBox(state, line = null) {
    for (let row = 0; row < boxes.length; row++) {
        for (let col = 0; col < boxes[row].length; col++) {
            for (let line = 0; line < 4; line++) {
                if (
                    (lineShouldShow.dot1 == boxes[row][col].lines[line].dot1 && lineShouldShow.dot2 == boxes[row][col].lines[line].dot2) ||
                    (lineShouldShow.dot1 == boxes[row][col].lines[line].dot2 && lineShouldShow.dot2 == boxes[row][col].lines[line].dot1)
                ) {
                    if (state) {
                        boxes[row][col].lastChage = "bot";
                    } else {
                        boxes[row][col].lastChage = "player";
                    }
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
                }
            }
        }
    }
    if (state) {
        if (line.side == "horizontal") {
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
        } else {
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
        }
    }
}

addEventListener("mousemove", (event) => {
    if (turn == "player") {
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
    }
});

addEventListener("mousedown", (event) => {
    let state = true;
    for (let i = 0; i < selectLines.length; i++) {
        if ((lineShouldShow.dot1 == selectLines[i].dot1 && lineShouldShow.dot2 == selectLines[i].dot2) || (lineShouldShow.dot1 == selectLines[i].dot2 && lineShouldShow.dot2 == selectLines[i].dot1)) {
            state = false;
        }
    }
    if (state) {
        for (let i = 0; i < botSelectedLines.length; i++) {
            if (
                (lineShouldShow.dot1 == botSelectedLines[i].dot1 && lineShouldShow.dot2 == botSelectedLines[i].dot2) ||
                (lineShouldShow.dot1 == botSelectedLines[i].dot2 && lineShouldShow.dot2 == botSelectedLines[i].dot1)
            ) {
                state = false;
            }
        }
    }
    if (turn == "player" && state) {
        turn = "computer";

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
        fixBox(false);
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
    ctx.strokeStyle = "rgb(0 , 0 , 0)";
    ctx.stroke();

    selectLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.dot1.x, line.dot1.y);
        ctx.lineTo(line.dot2.x, line.dot2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = line.color;
        ctx.stroke();
    });

    botSelectedLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.dot1.x, line.dot1.y);
        ctx.lineTo(line.dot2.x, line.dot2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255 , 0 , 0)";
        ctx.fill();
        ctx.stroke();
    });

    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes[i].length; j++) {
            boxes[i][j].draw();
            boxes[i][j].update();
        }
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(255 , 255 , 255 , 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
    if (turn == "computer") {
        let line = bot.calculate();
        lineShouldShow.dot1 = line[0].dot1;
        lineShouldShow.dot2 = line[0].dot2;
        fixBox(true, line[0]);
        botSelectedLines.push(line[0]);
        if (line[1] != "verygood") {
            turn = "player";
        }
    }
}
animate();
