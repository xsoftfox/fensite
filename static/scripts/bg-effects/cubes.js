var boxSize = 100;
var width, height;

function setup() {
  width = window.innerWidth;
  height = window.innerHeight;
  createCanvas(width, height, WEBGL);
  ortho();
}

function draw() {
  clear();
  rotateX(millis() / 2000);
  rotateY(millis() / 2000);
  translate(-width / 2, -height / 2);
  background(0);
  fill(0, 0);
  stroke(164, 97, 250);
  
  for(let x = 0; x < width; x+=boxSize) {
    for(let y = 0; y < height; y+=boxSize) {
      push();
      translate(x, y);
      box(boxSize);
      pop();
    }
  }
};