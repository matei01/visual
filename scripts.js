// check if the default naming is enabled, if not use the chrome one.
if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}
var context = new AudioContext();
var audioBuffer;
var sourceNode;

// load the sound
setupAudioNodes();
loadSound("sound.mp3");

function setupAudioNodes() {
    // create a buffer source node
    sourceNode = context.createBufferSource();
    // and connect to destination
    sourceNode.connect(context.destination);
}

// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);
    }
    request.send();
}


function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}

// log if an error occurs
function onError(e) {
    console.log(e);
}


// setup a analyzer

var canvas = document.getElementById("visualizer");
var ctx = canvas.getContext('2d');
// when the javascript node is called
// we use information from the analyzer node
// to draw the volume

/*function draw() {
    requestAnimationFrame(draw);
    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var ratio= 72*Math.PI/(array.length);
    var objectsCount = 12;
    var radius = 100;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.clearRect(0, 0, 600,600);
    ctx.beginPath();
    // you want to align objectsCount objects on the circular path
    // with constant distance between neighbors
    
    for (var i=0; i < array.length/36; i++) {
        /*var x = array[i*6]/2*Math.cos(ratio*i);
        var y = array[i*6]/2*Math.sin(ratio*i);
        if(array[6*i]<100)
            ctx.arc(200,150,100,ratio*i,ratio*(i+1),false);
        else{
            if(array[6*i]>190)
                ctx.arc(200,150,190,ratio*i,ratio*(i+1),false);
            else
                ctx.arc(200,150,array[6*i],ratio*i,ratio*(i+1),false);
        }
      // rotation of object in radians
       // ctx.lineTo(x+250,y+180);
      // set the CSS properties to calculated values
        if(i+1>array.length/36)
            ctx.arc(200,150,array[6*i],ratio*i,0,false);
            
    }
    ctx.stroke();
    

    /*var lastend=0;
    for (var j=0;j<=6;j++){
        ctx.moveTo(200,150);
        if(array[(array.length/6)*i]>150)
            ctx.arc(200,150,array[(array.length/6)*i],lastend+0.05,lastend+
                (Math.PI/3),false)
        else
            ctx.arc(200,150,array[(array.length/6)*i],lastend+0.05,lastend+
                (Math.PI/3),false);
        ctx.lineTo(200,150);
        lastend+=Math.PI/3;
        ctx.closePath();
        ctx.fillStyle="#FFA500";
        ctx.fill();
    }
  
    
    
  
  
}
*/
var a_increment=360/256;
var center= 250;
var minRad= 100;
var maxRad=110;
var firstPt=false;
function draw1(){
    requestAnimationFrame(draw1);
    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    ctx.clearRect(0, 0,1000,400);
    ctx.beginPath();
    var l=array.length;
    while(l-1>=0){
        var ang=(l*a_increment*Math.PI)/180;
        var radius= minRad + array[l]*(maxRad-minRad)/210;
        var x=center + Math.cos(ang)*radius;
        var y =center+Math.sin(ang)*radius;
        
        if(firstPt===false)
        {
            ctx.moveTo(x,y);
            firstPt=true;
        }
        else
            ctx.lineTo(x,y);
        l=l-1;
    }
    ctx.closePath();
    ctx.stroke();
    

}
javascriptNode.onaudioprocess = function() {

    draw1();
}

function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}
function setupAudioNodes() {
 
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    // create a buffer source node
    sourceNode = context.createBufferSource();

    // connect the source to the analyser
    sourceNode.connect(analyser);

    // we use the javascript node to draw at a specific interval.
    analyser.connect(javascriptNode);

    // and connect to destination, if you want audio
   sourceNode.connect(context.destination);
}
var i=1;
function stop() {
    sourceNode.stop(context.currentTime);
    i=2;
}
document.querySelector('.stop-button').addEventListener('click', function(){
  if(context.state === 'running') {
    context.suspend().then(function() {
    });
  } else if(context.state === 'suspended') {
    context.resume().then(function() {
    });  
  }    
});