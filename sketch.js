let detector;
let poses;
let video;

async function init(){
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet, 
      detectorConfig
    );
}

async function videoReady(){
  console.log('video ready');
  await getPoses();
}

async function setup() {
  createCanvas(640, 480); 
  video = createCapture(VIDEO, videoReady);
  //video = createCapture(VIDEO);
  //video.size(320, 240);
  video.hide();
  await init();
  //createButton('pose').mousePressed(getPoses);
}

async function getPoses(){ 
  poses = await detector.estimatePoses(video.elt);
  // console.log(poses);
  setTimeout(getPoses, 0);
}

function draw() {
  background(220);
  image(video, 50, 0, 640, 480);
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints){
      const {x, y, score } = kp;
      if (score > 0.5){
        console.log(poses[0].keypoints[0].y);
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(x, y, 12);
        fill(0,255,0);
        textSize(32);
        text('Fall Detection', 50, 50);
      }
    }
  }
}
