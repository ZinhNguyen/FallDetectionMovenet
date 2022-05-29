let numFrames = 158;
let capture;
let time = 0;

function setup() {
  frameRate();
  let canvas = createCanvas(640, 480);
  canvas.id('canvas');
  video = createVideo('dataset6/all/0.mp4');
  video.play();
  setTimeout(() => {
    2
  }, 500);
  video.hide();
  video.noLoop();
  capture = new CCapture({
    format: 'jpg',
    name: 'frames'
  });
}

function draw() {
  // a = video.time();
  // b = video.duration();
  // if(video.time()==video.duration()){
  //   print(1);
  // }
  if (frameCount == 1){
    console.log('starting recording...');
    capture.start();
  }
  if (frameCount === numFrames){
    console.log('done');
    noLoop();
    capture.stop();
    // capture.save();
    video.stop();
    return;
  }
  background(50);
  image(video, 0, 0, 640, 480);
  fill(0,255,0)
  textSize(20);
  text("frame count =" + frameCount, 100, 100)
  text("current frame = " + getFrameRate() ,100,150)
  text("total frame = " + 25* time,100,200)

  capture.capture(document.getElementById('canvas'));
}