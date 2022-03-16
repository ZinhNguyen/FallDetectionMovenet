let detector;
let poses;
let video;
let y_nose1;
let y_nose2;
let y_knee1;
let y_knee2;
let a = 1;
let Fall = 0;

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
  //createButton('pose').mousePressed(getPoses1);
}

async function getPoses(){ 
  poses = await detector.estimatePoses(video.elt);
  // console.log(poses[0].keypoints[0].y);
  if (poses && poses.length > 0){
    if(poses[0].keypoints[0].y > y_knee1 || poses[0].keypoints[0].y > y_knee2){
      a+=1;
      print(a);
      Fall = 1;
    }
    else Fall = 0;
    y_nose1 = poses[0].keypoints[0].y;
    y_knee1 = poses[0].keypoints[13].y;
    y_knee2 = poses[0].keypoints[14].y;
  }
  // console.log('y1= ', y_nose1);
  setTimeout(getPoses, 1000);
}

async function getPoses1(){ 
  poses1 = await detector.estimatePoses(video.elt);
  y_nose2 = poses1[0].keypoints[0].y
  console.log(y_nose2);
  setTimeout(getPoses, 2000);
}

function draw() {
  background(220);
  image(video, 0, 0, 640, 480);
  //print(y_nose1);
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints){
      const {x, y, score } = kp;
      if (score > 0.5){
        //console.log(poses[0].keypoints);
        //y_nose2 = poses[0].keypoints[0].y;
        // fill(255);
        // stroke(0);
        // strokeWeight(4);
        // circle(x, y, 12);
        if(Fall == 1) {
          //console.log(y_nose1);
          fill(0,255,0);
          textSize(32);
          text('Fall Detection', 50, 50);
        }
      }
    }
  }
}
