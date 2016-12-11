const drawChannel = "draw";
const hexDigits = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const id = Math.floor(Math.random() * 10000)

var drawList = [];
var color = getRandomColor();
var pubnub;

var container = document.getElementById("container");
container.onmouseup = function() {
  drawMode = false;
  sendDraw();
  context.closePath();
}

var canvas = document.getElementById("draw-canvas");
var context = canvas.getContext("2d");
var drawMode = false;

canvas.onmousedown = handleMouseDown;
canvas.onmousemove = handleMouseMove;
canvas.onmouseenter= handleMouseIn;

pubnubInit();

function pubnubInit() {

    pubnub = PUBNUB({
        publish_key : 'pub-c-7010b7c4-2580-49dc-af52-85e98b12ce23',
        subscribe_key : 'sub-c-f1637de6-bcec-11e6-b07a-0619f8945a4f',
        ssl: (location.protocol.toLowerCase() === 'https:')
    })

    console.log("Subscribing..");
    pubnub.subscribe({
        channel : "hello_world",
        message : function (message, envelope, channelOrGroup, time, channel) {
            console.log(
                "Message Received." + "\n" +
                "Channel or Group : " + JSON.stringify(channelOrGroup) + "\n" +
                "Channel : " + JSON.stringify(channel) + "\n" +
                "Message : " + JSON.stringify(message) + "\n" +
                "Time : " + time + "\n" +
                "Raw Envelope : " + JSON.stringify(envelope)
            )
        },
        connect : pub
    })

    function pub() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
        pubnub.publish({
            channel : "hello_world",
            message : "Hello from PubNub Docs!",
            callback : function(m){
                console.log(m)
            }
        })
    }

    pubnub.subscribe({
      channel: drawChannel,
      message : handleDrawReceive
    });
};

function getRandomColor() {
  var color = "#"
  for(var i = 0; i < 6; i++) {
    color += hexDigits[Math.floor(Math.random() * 16)];
  }

  return color;
}

function handleMouseDown(event) {
  drawMode = true;
  context.beginPath();
  context.moveTo(event.offsetX, event.offsetY);
}

function handleMouseMove(event) {
  if(drawMode) {
    context.strokeStyle = color;
    context.lineTo(event.offsetX, event.offsetY);
		context.stroke();
    drawList.push([event.offsetX, event.offsetY, color, id]);
  }
}

function handleMouseIn(event) {
  if(drawMode) {
    context.moveTo(event.offsetX, event.offsetY);
  }
}

function handleDrawReceive(message, envelope, channelOrGroup, time, channel) {
  drawFromList(message);
}

function drawFromList(list) {
  if(list.length <= 0) {
    return;
  }

  if(list[0][3] == id) {
    return;
  }

  context.beginPath();
  context.moveTo(list[0][0],list[0][1]);

  for(var i = 0; i < list.length; i++) {
    var x = list[i][0];
    var y = list[i][1];
    context.strokeStyle = list[i][2];
    context.lineTo(x,y);
  }

  context.stroke();
  context.closePath();
}

function sendDraw() {
  pubnub.publish({
    channel: drawChannel,
    message: drawList
  });
  drawList = [];
}
