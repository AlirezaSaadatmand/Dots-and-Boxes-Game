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

let lineShouldShow = {
    dot1: undefined,
    dot2: undefined,
};

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
    for (let i = 0; i <= widthBlock; i++) {
        for (let j = 0; j <= heightBlock; j++) {
            let x = i * widthUnit + widthUnit / 2;
            let y = j * heightUnit + heightUnit / 2;
            let newDot = new Dot(x, y);
            dots.push(newDot);

            let topline = { dot1: newDot, dot2: new Dot(x + widthUnit, y) };
            let rightline = { dot1: new Dot(x + widthUnit, y), dot2: new Dot(x + widthUnit, y + heightUnit) };
            let bottomline = { dot1: new Dot(), dot2: new Dot(x + widthUnit, y + heightUnit) };
            let leftline = { dot1: newDot, dot2: new Dot(x + widthUnit, y + heightUnit) };

            let newBox = new Box(x, y, topline, rightline, bottomline, leftline);
            boxes.push(newBox);
        }
    }
    lineShouldShow.dot1 = dots[0];
    lineShouldShow.dot2 = dots[1];
}
createDots();

function setLineOfBox(box, index) {
    if (index == 0) {
        box.topSel = true;
    } else if (index == 1) {
        box.rightSel == true;
    } else if (index == 2) {
        box.bottomSel = true;
    } else {
        box.leftSel = true;
    }
}

window.addEventListener("mousemove", (event) => {
    let lst = [];
    for (let i = 0; i < dots.length; i++) {
        lst.push(((event.clientX - dots[i].x) ** 2 + (event.clientY - dots[i].y) ** 2) ** (1 / 2));
    }
    let dis1 = Math.min(...lst);
    let dis1Index = lst.indexOf(dis1);
    lst[lst.indexOf(dis1)] = 2000;
    let dis2 = Math.min(...lst);
    let dis2Index = lst.indexOf(dis2);

    lineShouldShow.dot1 = dots[dis1Index];
    lineShouldShow.dot2 = dots[dis2Index];
});

window.addEventListener("mousedown", (event) => {
    if (lineShouldShow.dot1.x == lineShouldShow.dot2.x) {
        lines.push(new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "vertical"));
    } else {
        lines.push(new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "horizontal"));
    }

    boxes.forEach((box) => {
        box.lines.forEach((line) => {
            if ((lineShouldShow.dot1 == line.dot1 && lineShouldShow.dot2 == line.dot2) || (lineShouldShow.dot1 == line.dot2 && lineShouldShow.dot2 == line.dot1)) {
                console.log("hello");
                let index = box.lines.indexOf(line);
                setLineOfBox(box, index);
            }
        });
    });
});

function draw() {
    for (let i = 0; i < dots.length; i++) {
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(lineShouldShow.dot1.x, lineShouldShow.dot1.y);
    ctx.lineTo(lineShouldShow.dot2.x, lineShouldShow.dot2.y);
    ctx.fillStyle = "rgba(0 , 0 , 0, 0.1)";
    ctx.stroke();

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.fillStyle = line.color;
        ctx.stroke();
    });

    boxes.forEach((box) => {
        box.draw();
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(255 , 255 , 255 , 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
}
animate();
