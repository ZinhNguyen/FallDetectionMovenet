# Fall Detection using MoveNet model
This project was created to compare with OpenPose model.
## UR Fall Dataset: 
 Link: http://fenix.univ.rzeszow.pl/~mkepski/ds/uf.html
## Relative Article: 
 Link: https://www.researchgate.net/publication/341206883_Fall_Detection_Based_on_Key_Points_of_Human-Skeleton_Using_OpenPose

******How to extract from Video to Frame?*********
1. Go to index.html
2. uncomment for <script src="sketch_extractFrameVideo.js"></script> and comment for other script
	Like this:
    		<!-- <script src="sketch.js"></script> -->
    		<script src="sketch_extractFrameVideo.js"></script>
    		<!-- <script src="sketch_extractJson.js"></script> -->
3. Go to sketch_extractFrameVideo.js, Replace folder address from variable folder.
4. Setting FPS.
5. Change video name that need to extract.
6. Change Download location from Explorer (Chrome / Edge / IE..) where will save frame.
Note: The place to saved frame need to differ with project location.
Example:
	Project location : "E:\KLTN\Movenet\  
	Frame location : "E:\KLTN\ExtractFrame\
7. Turn off "Ask me what to do with each download" in setting Download of Explorer.
8. Make sure that "Live Server" Extention installed from your IDE(I used VScode)
9. Right click in index.html then choose "Open with live server". then wait until video extract finish.
10. if you want to extract with other video, Please change video name then "Save". 

******How to extract from Frame to Json file?********
1. Go to index.html
2. uncomment for <script src="sketch_extractJson.js"></script>
	Like this:
		<!-- <script src="sketch.js"></script> -->
    		<!-- <script src="sketch_extractFrameVideo.js"></script> -->
    		<script src="sketch_extractJson.js"></script>
3. Go to sketch_extractJson.js, Set Position of frame(Default is 1) , set first video Name, final video name(limit_video), and choose folder.
4. Choose model SINGLEPOSE_LIGHTNING , SINGLEPOSE_THUNDER, MULTIPOSE_LIGHTNING
5. Change Download location from Explorer (Chrome / Edge / IE..) where will save frame.
Note: The place to saved frame need to differ with project location.
Example:
	Project location : "E:\KLTN\Movenet\  
	Frame location : "E:\KLTN\ExtractJson\
6. Turn off "Ask me what to do with each download" in setting Download of Explorer.
7. Make sure that "Live Server" Extention installed from your IDE(I used VScode)
8. Right click in index.html then choose "Open with live server". then wait until json file was export.
9. if you want to extract with other video, Please change video name then "Save". 

