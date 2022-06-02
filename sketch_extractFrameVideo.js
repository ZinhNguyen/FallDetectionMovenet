let video;
let time = 0;
let loaded = false;
let vid = 186;
let video_flag = false;
let frame = 1;

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
          save(cnv, 'video' + vid + ' (' + frame +').jpg');
          frame+=1;
          // console.log(round(time*25));
          setTimeout(drawNextFrame, 70);
        } else {
          save(cnv, 'video' + vid + ' (' + frame +').jpg');
          frame+=1;
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
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(10);
  // text('Frame ' + round(time*25), 20, 10);
  text('Frame ' + frame, 20, 10);
  text("video = " +  vid, 20, 20);
}
// function resetSketch() {
//   vid+=1;
//   time=0;
// }
