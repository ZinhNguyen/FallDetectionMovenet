let detector, poses, video;
let x_nose, y_nose, x_knee1, y_knee1, x_knee2, y_knee2, x_ankle1, y_ankle1, x_ankle2, y_ankle2, x_kneeTB, y_kneeTB, x_ankleTB, y_ankleTB;
let y_left_hip, y_right_hip, mid_hip, p;
let angle = 0, Fall = 0, timer= 250;
let limit_video = 70;
let weight_body = 1;
let height_body = 2;
let frame1 = 0;
let condition_1 = false;
let condition_2 = false;
let condition_3 = false;
let frame_flag = 1;
let capture_flag = true;
const ScoreThreshold = 0.4;

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
}

// Load video before getposes
async function videoReady(){
  console.log('video ready');
  await getPoses();
}

// init for setup model
async function setup() {
  cnv = createCanvas(640, 480);
  // Change to capture via camera 
  video = createCapture(VIDEO, videoReady);
  // set size for video
  // video.size(320, 320);
  video.hide();
  await init();
  await getPoses();
  video.play();
}

// Function to get poses and check fall
async function getPoses(){ 
  poses = await detector.estimatePoses(video.elt);
  if (poses && poses.length > 0){
    // Re-check whether Objection Stand up after fall condition
    if(condition_1 != true || condition_2 || true && condition_3 || true){
      Fall = 0;
    }
    if(condition_1 == true){
      if(condition_2 == true ){
        if(condition_3 == true){
          Fall = 1;
        } 
      }
    }
    getCoordination();
  }
  setTimeout(getPoses, timer);
  checkCondition1();
  checkCondition2();
  checkCondition3();
}

  // Set for first condition
function checkCondition1(){
  frame_flag = y_nose;
  vel = abs((frame_flag - frame1)/0.25);
  if(vel > 0.009){
    condition_1 = true;
  }else {
    condition_1 = false;
  }
}

  // Set for second condition
function checkCondition2(){
  if (angle < 45) {
    condition_2 = true;
  } else {
    condition_2 = false;
  }
}

  //set for third condition
function checkCondition3() {
  p = weight_body/height_body;
  if (p > 1){
    condition_3 = true;
  } else {
    condition_3 = false;
  }
}
function getCoordination (){
    // Check Angle of objection
    oppsiteSide = Math.abs(x_kneeTB - x_nose);
    adjacentSide = Math.abs(y_kneeTB - y_nose);
    angle = (Math.atan(adjacentSide/oppsiteSide))*180/ PI;

    // Check height and weight of objection
    height_body = Math.abs(y_nose - y_ankleTB);
    weight_body = Math.abs(x_nose - x_ankleTB);

    // set coordinate for nose
    x_nose = poses[0].keypoints[0].x;
    y_nose = poses[0].keypoints[0].y;

    // set coordinate for hip
    y_left_hip = poses[0].keypoints[11].y;
    y_right_hip = poses[0].keypoints[12].y;
    mid_hip = (y_left_hip + y_right_hip) / 2;

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
    frame1 = frame_flag;
    for (let kp of poses[0].keypoints){
      const {x, y, score } = kp;
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
    text('Fall Detection', 50, 50);
    if(capture_flag == true){
      save(cnv,getTimeStamp() + '.jpg');
      sendMail();
      // console.log(getTimeStamp() + '.jpg');
      capture_flag = false;
    } 
  }
  else {
    fill(0,255,0);
    textSize(32);
    text('No Fall', 50, 50);
    capture_flag = true;
  }
}

// Function to get actual time to save image
function getTimeStamp() {
  var now = new Date();
  return (now.getFullYear() + "_" +
          (now.getMonth() + 1) + '_' +
          (now.getDate()) + '_' +         
           now.getHours() + '_' +
           ((now.getMinutes() < 10)
               ? ("0" + now.getMinutes())
               : (now.getMinutes())) + '_' +
           ((now.getSeconds() < 10)
               ? ("0" + now.getSeconds())
               : (now.getSeconds())));
}

// Function to get actual time alert
function getTimeStamp1() {
  var now = new Date();
  return (       
           now.getHours() + 'h' +
           ((now.getMinutes() < 10)
               ? ("0" + now.getMinutes())
               : (now.getMinutes())) + 'm' +
           ((now.getSeconds() < 10)
               ? ("0" + now.getSeconds())
               : (now.getSeconds())) + 's on ' +
               now.getDate() + '-' +
               (now.getMonth() + 1) + '-' +
               (now.getFullYear()));
}

// Function to send mail for alarming
function sendMail() {
    Email.send({
      // SecureToken : "ae99e3c1-9655-4444-b420-47770ca8764c",
      // From : "19522596@gm.uit.edu.vn",  
      SecureToken : "145051ea-7005-4230-b7eb-d55e413e9bbe",
      From : "joshua.miller@gmail.com", 
      To : 'qw0332211@gmail.com',
      Subject : "Fall Detection Alert",
      Body : "There is a Fall Detection at " + getTimeStamp1() + ".",
    Attachments : [
    {
      name : getTimeStamp() + ".jpg",
      data : canvas.toDataURL(),
    }]
  })
  }
