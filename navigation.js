function changeScript() {
  var x = document.getElementById("mySelect").value;
  switch(x){
    case "home":
    console.log(0);
      window.location.replace('index.html');    
      break;
    case "extFrame": 
      console.log(1);
      window.location.replace('videotoframe.html');
      break;
    case "extJson":
      console.log(2);
      window.location.replace('frametojson.html');
      break;
    default:  
      console.log(3);       
      window.location.replace('realtime.html');
  }
}