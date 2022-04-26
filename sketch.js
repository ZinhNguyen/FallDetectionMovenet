let detector, poses, video;
let x_nose, y_nose, x_knee1, y_knee1, x_knee2, y_knee2, x_ankle1, y_ankle1, x_ankle2, y_ankle2, x_kneeTB, y_kneeTB, x_ankleTB, y_ankleTB;
let height = 0, weight = 0, angle = 0, Fall = 0, ready = 0, CountFall = 0, timer= 0, flag_stand = 0, vid = 0;
let angle1 = 0;
let angle2 = 0;
let Count = true;
let a = 1;
let total = vid;
let limit_video = 70;
let weight_body = 1;
let height_body = 2;
const ScoreThreshold = 0.4;
let resultCount = 0;
let rate;
// Result to evaluate dataset
const eval = ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1'
,'0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']

// Initialize for MoveNet model
async function init(){
    const detectorConfig = {
      //SINGLEPOSE_LIGHTNING , SINGLEPOSE_THUNDER, MULTIPOSE_LIGHTNING
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

// init for setup model
async function setup() {
  createCanvas(640, 480);
  // Change to capture via camera 
  // video = createCapture(VIDEO, videoReady);
  video = createVideo('dataset/' + vid + '.mp4');
  //video.play();
  //video.loop();
  // set size for video
  // video.size(640, 480);
  video.hide();
  await init();
  await getPoses();
  video.play();
}

// Function to capture poses
async function getPoses(){ 
  poses = await detector.estimatePoses(video.elt);
  if (poses && poses.length > 0){
    // Re-check whether Objection Stand up after fall condition
    if(poses[0].keypoints[0].y < flag_stand && weight_body < height_body && angle < 45){
      Fall = 0;
    }
    // First condition
    if(poses[0].keypoints[0].y >= y_kneeTB){
      // Second condition
      if(angle >= 45 ){
        // third condition
        if(height_body/weight_body < 1){
          a+=1;
          // print(a);
          Fall = 1;
          if (poses[0].keypoints[0].y >= flag_stand){
            flag_stand = poses[0].keypoints[0].y;
          }
        } 
      }
    }

    // Check Angle of objection
    oppsiteSide = Math.abs(x_kneeTB - x_nose);
    adjacentSide = Math.abs(y_kneeTB - y_nose);
    angle = (Math.atan(oppsiteSide/adjacentSide))*180/ PI;

    // Check height and weight of objection
    height_body = Math.abs(y_nose - y_ankleTB);
    weight_body = Math.abs(x_nose - x_ankleTB);

    // Other way to check Angle
    // hypotenuse = Math.sqrt((Math.pow(x_ankle1 - x_nose,2) + Math.pow(y_ankle1 - y_nose,2)));
    // side_opposite_angle_1 = Math.abs(x_nose - x_ankle1);
    // side_opposite_angle_2 = Math.abs(x_nose - x_ankle2);
    // angle1 = Math.asin(side_opposite_angle_1/hypotenuse);
    // angle2 = Math.asin(side_opposite_angle_2/hypotenuse);
    // angle1 = angle1 * 180 / PI;
    // angle2 = angle2 * 180 / PI;
    // set coordinate for nose
    x_nose = poses[0].keypoints[0].x;
    y_nose = poses[0].keypoints[0].y;
    // set coordinate for knee
    x_knee1 = poses[0].keypoints[13].x;
    y_knee1 = poses[0].keypoints[13].y;
    x_knee2 = poses[0].keypoints[14].x;
    y_knee2 = poses[0].keypoints[14].y;   
    x_kneeTB = (x_knee1 + x_knee2)/2;
    y_kneeTB = (y_knee1 + y_knee2)/2;
    // set coordinate for ankle
    x_ankle1 = poses[0].keypoints[15].x;
    y_ankle1 = poses[0].keypoints[15].y;
    x_ankle2 = poses[0].keypoints[16].x;
    y_ankle2 = poses[0].keypoints[16].y;
    x_ankleTB = (x_ankle1 + x_ankle2)/2;
    y_ankleTB = (y_ankle1 + y_ankle2)/2;
  }
  setTimeout(getPoses, timer);
}

// Function to get new video
function increaseVideo(){
  if (vid < limit_video){
    a = 0;
    vid++;
    Count = true;
    setup();
  }
}

// Draw skeleton for objection
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

// Function to get Keypoint of object
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

// Function to draw skeleton and the result of test
function draw() {
  background(220);
  image(video, 0, 0);
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints){
      const {x, y, score } = kp;
      if (score > 0.3){
        fill(255);
        stroke(0);
        strokeWeight(2);
        circle(x, y, 6);
        fill(0,255,0);
        textSize(20);
        text(angle, 50, 100);
        text(flag_stand, 50, 150);
      }
    }
    // Set color for skeleton
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
    fill(255,0,0);
    textSize(32);
    text('Fall Detection', 350, 50);
  }
  else {
    fill(0,255,0);
    textSize(32);
    text('No Fall', 380, 50);
  }
  // Condition to calculate result and change to new video 
  if (video.time()==video.duration()){
    flag_stand = 0;
    if (Fall == 1 && Count == true){
      if (Fall == eval[vid]) {
        resultCount++;
      }
      CountFall++;
      Count = false;
      console.log('Video ', vid, ': Fall');
    } else {
      if (Fall == eval[vid]) {
        resultCount++;
      }
      console.log('Video ', vid, ': No Fall');
    }
    increaseVideo();
  }

  // waiting load metadata before playing
  if (video.loadedmetadata == true){
    ready = 1;
  } else {
    ready = 0;
  }

  // Draw Fall quantity on the screen
  fill(255,0,0);
  textSize(32);
  text('Fall: ' + CountFall + '/' + vid, 50, 50);
  fill(0,0,255);
  textSize(32);

  // Draw actual rate on the screen
  rate = (resultCount/vid)*100;
  rate = rate.toFixed(2)
  text('Rate: ' + rate + '%', 50, 200);
}
