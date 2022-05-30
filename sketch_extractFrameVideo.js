let video;
let time = 0;
let loaded = false;
let vid = 0;
let video_flag = false;

function setup() {
  cnv = createCanvas(640,480);
  noLoop();
  // let button = createButton("reset sketch");
  // button.mousePressed(resetSketch);
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
          // save(cnv, 'video' + vid + ' (' + round(time*25) +').jpg')
          setTimeout(drawNextFrame, 50);
        } else {
          save(cnv, 'video' + vid + ' (' + round(time*25) +').jpg')
          console.log("finish...");
          // time = 0;
          video.stop();
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
}

function draw() {
  if (!loaded) return;
  image(video, 0, 0);
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(10);
  text('Frame ' + round(time*25), 20, 10);
  text("video = " +  vid, 20, 20);
}
// function resetSketch() {
//   vid+=1;
//   time=0;
// }
