let detector, poses, video;
let x_nose, y_nose, x_knee1, y_knee1, x_knee2, y_knee2, x_ankle1, y_ankle1, x_ankle2, y_ankle2, x_kneeTB, y_kneeTB, x_ankleTB, y_ankleTB;
let height = 0, weight = 0, angle = 0, Fall = 0, ready = 0, CountFall = 0, timer= 0, flag_stand = 0;
let angle1 = 0;
let angle2 = 0;
let Count = true;
let a = 1;
let total = 0;
let vid = 0
let img_pos = 44;
let limit_video = 70;
let weight_body = 1;
let height_body = 2;
const ScoreThreshold = 0.4;
let resultCount = 0;
let rate;

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
  createCanvas(960, 720);
  // Change to capture via camera 
  // video = createCapture(VIDEO, videoReady);
  img = loadImage('imageDataset6/video0 (' + img_pos +').jpg');
  // resizeCanvas(img.width, img.height);
  await init();
  await getPoses();
}

// Use this function to extract Json file
function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileDefaultName = 'data '+ vid+'.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    //linkElement.click();

}


// Function to capture poses
async function getPoses(){ 
  poses = await detector.estimatePoses(img.elt);
  // exportToJsonFile(poses);
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
  image(img, 0, 0);
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
        // text(angle, 50, 100);
        // text(flag_stand, 50, 150);
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
  // Condition to calculate result and change to new video 
  // if (video.time()==video.duration()){
  //   // increaseVideo();
  // }

  // waiting load metadata before playing
  // if (video.loadedmetadata == true){
  //   ready = 1;
  // } else {
  //   ready = 0;
  // }

}
