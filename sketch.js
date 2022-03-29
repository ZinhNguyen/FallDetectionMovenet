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
let x_ankle1;
let y_ankle1;
let x_ankle2;
let y_ankle2;
let height = 0;
let weight = 0;
let weight1 = 0;
let weight2 = 0;
let angle1 = 0;
let angle2 = 0;
let a = 1;
let Fall = 0;
let ready = 0;
let vid = 1;
let limit_video = 40;
let CountFall = 0;
let Count = true;
let timer= 0;
let flag_stand = 0;

// Initialize for MoveNet model
async function init(){
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet, 
      detectorConfig,
    );
    flag_stand = 0;
    Fall = 0;
    ready = 0;
}

// Load video before getposes
async function videoReady(){
  console.log('video ready');
  await getPoses();
}


async function setup() {
  //createCanvas(640, 480); 
  createCanvas(640, 480); 
  //video = createCapture(VIDEO, videoReady);
  // video = createVideo('video/fall-'+ vid +'-cam0.mp4');
  video = createVideo('video/adl-'+ vid +'-cam0.mp4');
  //console.log(vid);
  //video.play();
  //video.loop();
  //video.size(1280, 480);
  video.hide();
  await init();
  await getPoses();
  //createButton('pose').mousePressed(getPoses);
  // createButton('Pause').mousePressed(pause);
  // createButton('Play').mousePressed(play);
  if (ready == 1) {
    video.play();
  }
}

function pause(){
  video.pause();
}
function play(){
  video.play();
}


async function getPoses(){ 
  ready = 0;
  poses = await detector.estimatePoses(video.elt);
  //console.log(poses[0].keypoints[0].y);
  ready = 1;
  if (poses && poses.length > 0){
    // First condition
    if(poses[0].keypoints[0].y >= y_knee1 || poses[0].keypoints[0].y >= y_knee2){
      if(angle1 >= 45 || angle2 >= 45){
        if(height_body/weight_body < 1){
          a+=1;
          print(a);
          Fall = 1;
          if (poses[0].keypoints[0].y > flag_stand){
            flag_stand = poses[0].keypoints[0].y;
          }
        } 
      }
    }
    if(poses[0].keypoints[0].y < flag_stand && weight_body < height_body && angle1 < 45 && angle2 < 45){
      Fall = 0;
    }
    //else Fall = 0;
    // // Second condition
    // if(angle1 > 45 || angle2 > 45){
    //   a+=1;
    //   print(a);
    //   Fall = 1;
    // }
    // else Fall = 0;
    hypotenuse = Math.sqrt((Math.pow(x_ankle1 - x_nose,2) + Math.pow(y_ankle1 - y_nose,2)));
    height_body = Math.abs(y_nose - y_ankle1);
    weight_body = Math.abs(x_nose - x_ankle1);
    // let a = Math.pow(x_knee1 - x_nose,2);
    // let b = Math.pow(y_knee1 - y_nose,2);
    // height = Math.sqrt(a + b);
    side_opposite_angle_1 = Math.abs(x_nose - x_ankle1);
    side_opposite_angle_2 = Math.abs(x_nose - x_ankle2);
    // angle = weight1/height;
    angle1 = Math.asin(side_opposite_angle_1/hypotenuse);
    angle2 = Math.asin(side_opposite_angle_2/hypotenuse);
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
    x_ankle1 = poses[0].keypoints[15].x;
    y_ankle1 = poses[0].keypoints[15].y;
    x_ankle2 = poses[0].keypoints[16].x;
    y_ankle2 = poses[0].keypoints[16].y;
  }

  setTimeout(getPoses, timer);
}

function draw() {
  background(220);
  image(video, 0, 0);
  //filter(THRESHOLD);
  //print(video.elt);
  //console.log(poses);
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints){
      const {x, y, score } = kp;
      if (score > 0.3){
        //console.log(poses[0].keypoints);
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(x, y, 12);
        //test angle
        fill(0,255,0);
        textSize(20);
        text(flag_stand, 50, 100);
        text(poses[0].keypoints[0].y, 50, 150);
      }
    }
  }
  if(Fall == 1) {
    //console.log(y_nose1);
    fill(255,0,0);
    textSize(32);
    text('Fall Detection', 350, 50);
  }
  else {
    fill(0,255,0);
    textSize(32);
    text('No Fall', 350, 50);
  }
  if (video.time()==video.duration()){
    //console.log('finished video');
    if (Fall == 1 && Count == true){
      CountFall++;
      Count = false;
      console.log('File ', vid, ': Fall');
      Fall = 0;
    } else {
      console.log('File ', vid, ': No Fall');
      Fall = 0;
    }
    if (vid < limit_video){
      a = 0;
      vid++;
      Count = true;
      setup();
    }
  }
  fill(255,0,0);
  textSize(32);
  text('Fall: ' + CountFall, 50, 50);
}
