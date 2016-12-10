function publish() {

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

var canvas = document.getElementById("draw-canvas");
var drawMode = false;
function handleMouseDown() {
  drawMode = true;
}

function handleMouseUp() {
  drawMode = false;
}

function handleMouseMove(event) {
  if(drawMode) {
    console.log(event.x);
  }
}

canvas.onmousedown = handleMouseDown;
canvas.onmouseup = handleMouseUp;
canvas.onmousemove = handleMouseMove;
