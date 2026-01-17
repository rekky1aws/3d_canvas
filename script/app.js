/*
(x, y, z)
x' = x/z
y' = y/z

(x,y) = (0,0) = center of canvas
z = 0 = viewer's eyese
z = 1 = screen
z > 1 = further than screen
*/
const animToggle = document.querySelector('#animate-chbx');
const linesToggle = document.querySelector('#draw-lines-chbx');
const cornerToggle = document.querySelector('#draw-corners-chbx');

const BG = "#1D1D1D";
const FG = "#66FF66";
const FPS = 60;
const DS = 20;

let dzGlobal = 0;
let dAngleGlobal = 0;

canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

// Canvas size
function squareCanvas () {
  let size = Math.min(window.innerWidth, window.innerHeight);
  if (size % 100 == 0) {
    size -= 10;
  }
  size = size - size%100;

  canvas.width = size - 10;
  canvas.height = size - 10;
}

// Draw
function clearCanvas() {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDot (dot) {
  ctx.fillStyle = FG;
  ctx.fillRect(dot.x - DS/2, dot.y - DS/2, DS, DS);
}

function drawProjectedDot (dot) {
  const projDotSize = DS/dot.z;
  ctx.fillStyle = FG;
  ctx.fillRect(dot.x - projDotSize/2, dot.y - projDotSize/2, projDotSize, projDotSize);
}

function drawLine (dotA, dotB) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = FG;
  ctx.beginPath();
  ctx.moveTo(dotA.x, dotA.y);
  ctx.lineTo(dotB.x, dotB.y);
  ctx.stroke();
}

function drawPolyDots (poly) {
  poly.dots.forEach (d => {
    drawProjectedDot(coordsToScreen(project2D((d))));
  });
}

function drawPolyLines (poly) {
  poly.lines.forEach(l => {
    drawLine(
        coordsToScreen(project2D(poly.dots[l.a])),
        coordsToScreen(project2D(poly.dots[l.b]))
      );
  });
}

// Maths
function project2D (dot) { // Projects 3D point to 2D plan
  return {
    ...dot,
    x: dot.x/dot.z,
    y: dot.y/dot.z,
  }
}

function coordsToScreen (dot) { // Takes normalized coordinates (-1 => 1) and transforms them to canvas coordinates (0 => canvas.size)
  return {
    ...dot,
    x: ((dot.x + 1) / 2) * canvas.width,
    y: (1 - ((dot.y + 1) / 2)) * canvas.height,
  }
}

function rotate (dot, angles = {x: 0, y: 0, z:0}) { // Rotates a point about 0,0,0
  let resDot = {}; 

  resDot = { // rotating around y axis
    ...dot,
    x: (dot.x*Math.cos(angles.y))-(dot.z*Math.sin(angles.y)),
    z: (dot.x*Math.sin(angles.y))+(dot.z*Math.cos(angles.y))
  };

  resDot = { // rotating around x axis
    ...resDot,
    y: (resDot.y*Math.cos(angles.x))-(resDot.z*Math.sin(angles.x)),
    z: (resDot.y*Math.sin(angles.x))+(resDot.z*Math.cos(angles.x))
  }

  resDot = { // rotating around z axis
    ...resDot,
    x: (resDot.y*Math.sin(angles.z))+(resDot.x*Math.cos(angles.z)),
    y: (resDot.y*Math.cos(angles.z))-(resDot.x*Math.sin(angles.z)),
  };

  return resDot;
}

function translate (dot, delta = {x: 0, y: 0, z: 0}) {
  return {
    x: dot.x + delta.x,
    y: dot.y + delta.y,
    z: dot.z + delta.z,
  }
}

// Maths Poly
function polyRotate (poly, angles = {x: 0, y: 0, z: 0}) { // Rotate polypoint about 0,0,0
  let dots = [];
  poly.dots.forEach(d => {
    dots.push(rotate(d, angles));
  });

  return {
    ...poly,
    dots
  };
}

function polyTranslate (poly, delta = {x: 0, y: 0, z: 0}) { // Translates polypoint
  let dots = [];
  poly.dots.forEach(d => {
    dots.push(translate(d, delta));
  });

  return {
    ...poly,
    dots
  };
}


// Animation
function frame () {
  clearCanvas();

  if (animToggle.checked) {
    dzGlobal += 1/FPS;
    dAngleGlobal = (dAngleGlobal + (1/FPS)) % (Math.PI *2);
  }

  // drawPolyLines(polyTranslate(polyRotateY(cube3, dAngleGlobal), 0, 0, 1.5));
  // drawPolyLines(polyTranslate(polyRotateX(cube3, dAngleGlobal), 0, 0, 1.5));
  // drawPolyLines(polyTranslate(polyRotateZ(cube3, dAngleGlobal), 0, 0, 1.5));

  // drawPolyLines(polyTranslate(polyRotateZ(polyRotateX(polyRotateY(cube3, dAngleGlobal), dAngleGlobal), dAngleGlobal), 0, 0, 1.5));

  if (linesToggle.checked) {
    drawPolyLines(polyTranslate(polyRotate(cube3, {x: dAngleGlobal, y: dAngleGlobal, z:dAngleGlobal}), {x: 0, y: 0, z: 1.25 }));
  }

  if (cornerToggle.checked) {
    drawPolyDots(polyTranslate(polyRotate(cube3, {x: dAngleGlobal, y: dAngleGlobal, z:dAngleGlobal}), {x: 0, y: 0, z: 1.25 }));
  }
}


// MAIN
squareCanvas();
// drawPolyLines(polyTranslate(cube3, 0, 0, 0.4));
setInterval(frame, 1000/FPS);