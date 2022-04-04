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
let CountFall = 0;
let Count = true;
let timer= 0;
let flag_stand = 0;
let vid = 1;
let limit_video = 30;
//Fall dataset
var fall_dataset = 'video/fall-';
// var fall_dataset = 'video/adl-';
var fall_default = '-cam0.mp4';
// var dataset = 'video1/fall-13-cam1.mp4';
//NoFall dataset
//var dataset = 'video/adl-'+ vid +'-cam0.mp4';
const ScoreThreshold = 0.4;

// Initialize for MoveNet model
      //SINGLEPOSE_LIGHTNING , SINGLEPOSE_THUNDER, MULTIPOSE_LIGHTNING
async function init(){
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      // enableTracking: true,
      // trackerType: poseDetection.TrackerType.BoundingBox,
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
  // video = createCapture(VIDEO, videoReady);
  // video = createVideo(fall_dataset + vid + fall_default);
  video = createVideo('video1/' + 33 + '.mp4');
  // video = createVideo(dataset);
  //console.log(vid);
  //video.play();
  //video.loop();
  // video.size(640, 480);
  video.hide();
  await init();
  await getPoses();
  // createButton('pose').mousePressed(getPoses1);
  // createButton('Pause').mousePressed(pauseAndGetPose1);
  // createButton('Play').mousePressed(play);
  //if (ready == 1) {
  video.play();
  //}
}

function pauseAndGetPose1(){
  video.pause();
  getPoses1();
}
function play(){
  video.play();
}

async function getPoses1(){
  poses = await detector.estimatePoses(video.elt);
  print(poses);
}


async function getPoses(){ 
  //ready = 1;
  // if (ready == 1){
    poses = await detector.estimatePoses(video.elt);
  // }
  //console.log(poses[0].keypoints[0].y);
  // ready = 1;
  if (poses && poses.length > 0){
    // console.log(poses[0]);
    // First condition
    if(poses[0].keypoints[0].y >= y_knee1 || poses[0].keypoints[0].y >= y_knee2){
      if(angle1 >= 45 || angle2 >= 45){
        if(height_body/weight_body < 1){
          a+=1;
          //print(a);
          Fall = 1;
          if (poses[0].keypoints[0].y > flag_stand){
            flag_stand = poses[0].keypoints[0].y;
          }
        } 
      }
    }
    // Stand up after fall condition
    // if(poses[0].keypoints[0].y < flag_stand && weight_body < height_body && angle1 < 45 && angle2 < 45){
    //   Fall = 0;
    // }
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

function increaseVideo(){
  if (vid < limit_video){
    a = 0;
    vid++;
    Count = true;
    setup();
  }
}

const skeleton = [
	[0, 1],
	[0, 2],
	[1, 3],
	[2, 4],
	[[6, 5]],
	[6, 5],
	[5, 7],
	[6, 8],
	[7, 9],
	[8, 10],
	[[5, 6],[11, 12]],
	[[11, 12], 11],
	[[11, 12], 12],
	[11, 13],
	[12, 14],
	[13, 15],
	[14, 16],
];

function getKeypointForEdgeVertex(keypoints, vertex) {
	if (typeof vertex === "number") {
		const {
			x,
			y,
			score
		} = keypoints[vertex];
		if (score > ScoreThreshold) {
			return { x, y };
		}
	} else if (vertex instanceof Array) {
		const points = vertex.map(v => keypoints[v]);
		if (points.every(kp => kp.score > ScoreThreshold)) {
			const { x, y } =
						// Average the points
						points.reduce(
							(acc, v) => ({
								x: (acc.x * acc.w + v.x) / (acc.w + 1),
								y: (acc.y * acc.w + v.y) / (acc.w + 1),
								w: acc.w + 1
							}),
							{ x: 0, y: 0, w: 0 }
						);
		  return { x, y };
		}
	}
}

function draw() {
  background(220);
  image(video, 0, 0);
  // filter(THRESHOLD);
  //print(video.elt);
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints){
      const {x, y, score } = kp;
      if (score > 0.3){
        //console.log(poses[0].keypoints);
        fill(255);
        stroke(0);
        strokeWeight(2);
        circle(x, y, 6);
        //test angle
        fill(0,255,0);
        textSize(20);
        text(flag_stand, 50, 100);
        text(poses[0].keypoints[0].y, 50, 150);
      }
    }
    stroke('yellow');
    strokeWeight(2);
    for (let edge of skeleton) {
      let start = getKeypointForEdgeVertex(poses[0].keypoints, edge[0]);
      let end = getKeypointForEdgeVertex(poses[0].keypoints, edge[1]);
      if (start && end) {
        line(start.x, start.y, end.x, end.y);
      }
    }
  }
  stroke(0);
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
      console.log('Video ', vid, ': Fall');
    } else {
      console.log('Video ', vid, ': No Fall');
    }
    increaseVideo();
  }
  if (video.loadedmetadata == true){
    ready = 1;
  } else {
    ready = 0;
  }
  fill(255,0,0);
  textSize(32);
  text('Fall: ' + CountFall, 50, 50);
}
