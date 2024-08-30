const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let widthBlock = 15;
let heightBlock = 7;

let dots = [];

let lines = [];

let lineShouldShow = {
  dot1: null,
  dot2: null,
};

class Dot {
  constructor(id, x, y, xpos, ypos) {
    this.id = id;
    this.x = x;
    this.y = y;

    this.xpos = xpos;
    this.ypos = ypos;
  }
}

class Line {
  constructor(d1, d2, color, side) {
    this.start = d1;
    this.end = d2;
    this.color = color;
    this.side = side;
  }
}

class Squere {
  constructor(line1, line2, line3, line4) {
    this.line1 = line1;
    this.line2 = line2;
    this.line3 = line3;
    this.line4 = line4;
  }
}

function createDots() {
  let widthUnit = innerWidth / (widthBlock + 1);
  let heightUnit = innerHeight / (heightBlock + 1);
  let count = 1;
  for (let i = 0; i <= widthBlock; i++) {
    for (let j = 0; j <= heightBlock; j++) {
      dots.push(
        new Dot(
          count,
          i * widthUnit + widthUnit / 2,
          j * heightUnit + heightUnit / 2,
          i,
          j
        )
      );
      count++;
    }
  }
}
createDots();

window.addEventListener("mousemove", (event) => {
  let lst = [];
  for (let i = 0; i < dots.length; i++) {
    lst.push(
      ((event.clientX - dots[i].x) ** 2 + (event.clientY - dots[i].y) ** 2) **
        (1 / 2)
    );
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
    lines.push(
      new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "vertical")
    );
  } else {
    lines.push(
      new Line(lineShouldShow.dot1, lineShouldShow.dot2, "white", "horizontal")
    );
  }
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
}

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(255 , 255 , 255 , 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  draw();
}
animate();
