// based on code from this  
// https://thecodingtrain.com/CodingChallenges/160-spring-forces.html
// https://youtu.be/Rr-5HiXquhw


let bob;
let anchor;
let velocity;
let restLength = 200;
let k = 0.05;
let gravity;
let img;

function preload() {
    // Load the image
    headImg = loadImage("head.png");
    earLImg = loadImage("ear.l.png");
    earRImg = loadImage("ear.r.png");
  }

function setup() {
  createCanvas(400, 600);
  imageMode(CORNERS);
  bob = createVector(-100, 200);
  anchor = createVector(180, 450);
  velocity = createVector(0, 0);
  gravity = createVector(-4, -4);
}

function draw() {
  background('#956db3');
  //clear(); //transparent bg
  strokeWeight(4);
  stroke(255);
  fill(45, 197, 244);
  image(earLImg, bob.x + 60, bob.y +80, 220, 490);
  image(earRImg, 210, 330, 420, 490);
  image(headImg, 0, 250, 400, 720);
  line(anchor.x, anchor.y, bob.x, bob.y);

  if (mouseIsPressed) {
    bob.x = mouseX - 60;
    bob.y = mouseY - 80;
    velocity.set(0, 0);
  }

  let force = p5.Vector.sub(bob, anchor);
  let x = force.mag() - restLength;
  force.normalize();
  force.mult(-1 * k * x);

  // F = A
  velocity.add(force);
  velocity.add(gravity);
  bob.add(velocity);
  velocity.mult(0.96);
}
