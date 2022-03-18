let detector;
let poses;
let video;
let x_nose;
let y_nose;
// let y_nose2;
let x_knee1;
let y_knee1;
let x_knee2;
let y_knee2;
let height = 0;
let weight = 0;
let weight1 = 0;
let weight2 = 0;
let angle1 = 0;
let angle2 = 0;
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
  // video = createCapture(VIDEO, videoReady);
  video = createVideo(['E:/Entertainment/xam/20160723_095852.mp4']);
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
    // First condition
    if(poses[0].keypoints[0].y > y_knee1 || poses[0].keypoints[0].y > y_knee2){
      if(angle1 > 45 || angle2 > 45){
        a+=1;
        print(a);
        Fall = 1;
      }
    }
    else Fall = 0;
    // // Second condition
    // if(angle1 > 45 || angle2 > 45){
    //   a+=1;
    //   print(a);
    //   Fall = 1;
    // }
    // else Fall = 0;
    height = Math.sqrt((Math.pow(x_knee1 - x_nose,2) + Math.pow(y_knee1 - y_nose,2)));
    // let a = Math.pow(x_knee1 - x_nose,2);
    // let b = Math.pow(y_knee1 - y_nose,2);
    // height = Math.sqrt(a + b);
    weight1 = Math.abs(x_nose - x_knee1);
    weight2 = Math.abs(x_nose - x_knee2);
    // angle = weight1/height;
    angle1 = Math.asin(weight1/height);
    angle2 = Math.asin(weight2/height);
    // angle = 3*PI/2;
    angle1 = angle1 * 180 / PI;
    angle2 = angle2 * 180 / PI;
    //console.log(height);
    x_nose = poses[0].keypoints[0].x;
    y_nose = poses[0].keypoints[0].y;
    x_knee1 = poses[0].keypoints[13].x;
    y_knee1 = poses[0].keypoints[13].y;
    x_knee2 = poses[0].keypoints[14].x;
    y_knee2 = poses[0].keypoints[14].y;
  }
  setTimeout(getPoses, 100);
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
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(x, y, 12);
        //test angle
        fill(0,255,0);
        textSize(32);
        text(angle1, 50, 100);
        text(angle2, 50, 150);
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
