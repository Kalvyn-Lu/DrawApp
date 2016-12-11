const drawChannel = "draw";
var drawList = [];

var pubnub;

function pubnubInit() {

    pubnub = PUBNUB({
        publish_key : 'pub-c-7010b7c4-2580-49dc-af52-85e98b12ce23',
        subscribe_key : 'sub-c-f1637de6-bcec-11e6-b07a-0619f8945a4f'
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
};

pubnubInit();

var canvas = document.getElementById("draw-canvas");
var context = canvas.getContext("2d");
var drawMode = false;

function handleMouseDown(event) {
  drawMode = true;
  context.beginPath();
  context.moveTo(event.offsetX, event.offsetY);
}

function handleMouseUp() {
  drawMode = false;
  context.stroke();
  sendDraw();
}

function handleMouseMove(event) {
  if(drawMode) {
    context.lineTo(event.offsetX, event.offsetY);
		context.stroke();
    drawList.push([event.offsetX, event.offsetY]);
  }
}

function handleMouseIn(event) {
  if(drawMode) {
    context.moveTo(event.offsetX, event.offsetY);
  }
}

function handleMouseOut(event) {
  if(drawMode) {
    sendDraw();
  }
}

canvas.onmousedown = handleMouseDown;
canvas.onmouseup = handleMouseUp;
canvas.onmousemove = handleMouseMove;
canvas.onmouseenter= handleMouseIn;

//Handling the drawing events
var peerContext = canvas.getContext("2d");

pubnub.subscribe({
  channel: drawChannel,
  message : handleDrawReceive
});

function handleDrawReceive(message, envelope, channelOrGroup, time, channel) {
  drawFromList(message);
}

function drawFromList(list) {
  peerContext.beginPath();
  peerContext.moveTo(list[0][0],list[0][1]);

  for(var i = 0; i < list.length; i++) {
    var x = list[i][0];
    var y = list[i][1];
    peerContext.lineTo(x,y);
  }

  peerContext.stroke();
}

function sendDraw() {
  pubnub.publish({
    channel: drawChannel,
    message: drawList
  });
  drawList = [];
}

var container = document.getElementById("container");
container.onmouseup = function() {
  drawMode = false;
  console.log("gi");
}
