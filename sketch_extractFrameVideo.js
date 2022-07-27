let video;
let time = 0;
let loaded = false;
let video_flag = false;
let frame = 1;
//Set Video Name to extract
// let videName = document.currentScript.getAttribute('videoName');
//Set frame for Video before extracting!
let FPS;
//Set folder that stored video! 
const folder = 'video/';

// console.log(videName);

function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

var params = getSearchParameters();
videoName = params.files;
vidName = params.files.slice(0,-4);
FPS = params.fps;

function setup() {
  cnv = createCanvas(640,480);
  noLoop();
  // let button = createButton("reset sketch");
  // button.mousePressed(resetSketch);
  video = createVideo(folder + videoName, () => {
    resizeCanvas(video.width, video.height);
    loaded = true;
    // video.volume(0);
    video.hide();
    
    const drawNextFrame = () => {
      // Only draw the image to the screen when the video
      // seek has completed
      const onSeek = () => {
        draw();
        video.elt.removeEventListener('seeked', onSeek);
        // Wait a half second and draw the next frame
        if(video.time() != video.duration()){
          save(cnv, 'video' + vidName + ' (' + frame +').jpg');
          frame+=1;
          // console.log(round(time*25));
          setTimeout(drawNextFrame, 100);
        } else {
          save(cnv, 'video' + vidName + ' (' + frame +').jpg');
          frame+=1;
          console.log("finish...");
          // time = 0;
          video.stop();
        }
      };
      video.elt.addEventListener('seeked', onSeek);
      
      // Start seeking ahead
      video.time(time); // Seek ahead to the new time
      time += 1/FPS;
      // console.log(video.time())
      // console.log(video.duration())
    };
    drawNextFrame();
  });
}

function draw() {
  if (!loaded) return;
  image(video, 0, 0);
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(10);
  // text('Frame ' + round(time*25), 20, 10);
  text('Frame ' + frame, 30, 10);
  text("video = " +  vidName, 30, 20);
}
