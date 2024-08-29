const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
let widthBlock = 20;
let heightBlock = 10;

let dots = [];

let showLines = [];

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(d1, d2) {
    this.start = d1;
    this.end = d2;
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

function drawDots() {
  let widthUnit = innerWidth / (widthBlock + 1);
  let heightUnit = innerHeight / (heightBlock + 1);

  for (let i = 0; i <= widthBlock; i++) {
    for (let j = 0; j <= heightBlock; j++) {
      dots.push([
        i * widthUnit + widthUnit / 2,
        j * heightUnit + heightUnit / 2,
        "black",
      ]);
    }
  }
}
drawDots();

addEventListener("mousemove", (event) => {});

function draw() {
  for (let i = 0; i < dots.length; i++) {
    console.log(dots);
    ctx.beginPath();
    ctx.arc(dots[i][0], dots[i][1], 5, 0, Math.PI * 2, false);
    ctx.fillStyle = dots[i][2];
    ctx.fill();
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);
  draw();
}
animate();
