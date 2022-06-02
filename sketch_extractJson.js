let detector, poses, video;
let vid = 0;
let img;
let img_pos = 158;
let limit_video = 10;
const ScoreThreshold = 0.4;
let resultCount = 0;
let timer = 0;
let reset_flag = false;
let isExistsFile = true;
let loaded = false;

// Initialize for MoveNet model
async function init(){
    const detectorConfig = {
      //SINGLEPOSE_LIGHTNING , SINGLEPOSE_THUNDER, MULTIPOSE_LIGHTNING
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    //   enableTracking: true,
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
    //   video = createCapture(VIDEO, videoReady);
    // let button = createButton("reset sketch");
    // button.mousePressed(resetSketch);
    img = loadImage('imageDataset6/video'+ vid +' (' + img_pos +').jpg',
        () => isExistsFile = true,
        () => isExistsFile = false,);
    // resizeCanvas(img.width, img.height);
    console.log('ready')
    //   video.hide();
    await init();
    await getPoses();
    reset_flag = true;
    loaded = true;
}

// Use this function to extract Json file
function exportToJsonFile(jsonData) {
    if (loaded == true) {
        let dataStr = JSON.stringify(jsonData);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        let exportFileDefaultName = 'data '+ vid + ' (' + img_pos +').json';
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    loaded = false;
}


// Function to capture poses
async function getPoses(){ 
    poses = await detector.estimatePoses(img.canvas);
    // exportToJsonFile(poses);
    setTimeout(getPoses, timer);
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
    // background(220);
    image(img,0,0);
    // console.log('test');
    // image(img, 0, height/28, img.width/2, img.height/2);
    // console.log(poses);
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
    // console.log(reset_flag);
    checkVideo();
}

function checkVideo(){
    if (loaded == true && reset_flag ==true && isExistsFile == true){
        // setTimeout(resetSketch(),100)
        resetSketch();
        reset_flag = false;
    }
    if (isExistsFile == false){
        // console.log(1);
        increaseVideo();
    }
}

function resetSketch() {
    isExistsFile = true;
    exportToJsonFile(poses);
    img_pos+=1;
    setup();
}
// Function to get new video
function increaseVideo(){
    if (vid < limit_video){
        vid+=1;
        img_pos=1;
        setup();
    } else {
        console.log('Finish');
    }
    isExistsFile = true;
}