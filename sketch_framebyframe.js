let video;
let time = 0;
let loaded = false;
let vid = 0;
let video_flag = false;
let numFrames = 300;
let capture;

function setup() {
  createCanvas(400, 400);
  noLoop();
  let button = createButton("reset sketch");
  button.mousePressed(resetSketch);
  video = createVideo('dataset6/all/'+ vid +'.mp4', () => {
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
          setTimeout(drawNextFrame, 500);
        } else {
          console.log("finish...");
          // time = 0;
          video_flag = true;
          
        }
      };
      video.elt.addEventListener('seeked', onSeek);
      
      // Start seeking ahead
      video.time(time); // Seek ahead to the new time
      time += 1/25;
      // console.log(video.time())
      // console.log(video.duration())
    };
    drawNextFrame();
  });
  video.play();
}

function draw() {
  if (!loaded) return;
  image(video, 0, 0);
  fill('#F00');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(20);
  text(round(time*25), 20, 20);
  text("video = " +  vid, 20, 40);
  text("video_flag = " +  video_flag, 20, 60);
  if (video_flag==true){
    time = 0;
    // vid+=1;
    setup();
    video_flag = false;
  }
}
function resetSketch() {
  saveFrames('out', 'png', 1, 25, data => {
    print(data);
  });
  }