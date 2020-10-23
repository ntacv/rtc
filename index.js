// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const uuid4 = require("uuid4");


const d = document;
var info = d.querySelector('#info');

function onClick() {
  
  // feature detect
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
      window.addEventListener('deviceorientation', () => {});
      }
    })
    .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
    alert('ios13');
  }
  }

function deviceOrientationListener(event) {
  var data = d.querySelector('#data');
  
  var alpha = Math.round(event.alpha);
  var beta = Math.round(event.beta);
  var gamma = Math.round(event.gamma);
  data.innerHTML = 'data : <br>'+ alpha+'<br>'+beta+'<br>'+gamma;
  }

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", deviceOrientationListener);
  info.innerHTML =info.innerHTML+ " it works";
  
  /*window.addEventListener("deviceorientation", function(e){
    
    info.innerHTML = info.innerHTML+ ' '+ e.webkitCompassHeading;//window.DeviceOrientationEvent.alpha;
  })*/
} else {
  info.innerHTML = "Open that page on a phone that support motion events";
}
      
function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  
  d.querySelector('.g-signin2').style.display = 'none';
  d.querySelector('#profileImg').src = profile.getImageUrl();
  // The ID token you need to pass to your backend:
  var idToken = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + idToken);
  }


/*
var sensor = Windows.Devices.Sensors.Inclinometer.getDefault();
if (sensor == null){
  
}else{
  console.log(displaySensorReading(sensor.getCurrentReading()));
  console.log(reading.pitchDegrees.toFixed(1));
}
*/


// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
 .listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);

// Register "connection" events to the WebSocket
io.on("connection", function(socket) {
  // Register "join" events, requested by a connected client
  socket.on("join", function (room) {
    // join channel provided by client
    socket.join(room)
    // Register "image" events, sent by the client
    socket.on("image", function(msg) {
      // Broadcast the "image" event to all other clients in the room
      socket.broadcast.to(room).emit("image", msg);
    });
  })
});