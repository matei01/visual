var acontext= new (window.AudioContext || window.webkitAudioContext);
var source;
var songs=["song1.mp3","song2.mp3"];
var songNames=["Alchemist ft. Nas and Prodigy-Tick Tock","Alchemist ft. Nina Sky & Illa Gee- Hold you Down"];

var analyser=acontext.createAnalyser();
analyser.fftSize = 2048;
var bufferLength = analyser.fftSize;
var dataArray = new Uint8Array(bufferLength);

var scriptNode = acontext.createScriptProcessor(2048, 1, 1);
scriptNode.connect(acontext.destination);
playSong(0);

analyser.connect(scriptNode);



scriptNode.onaudioprocess=function(){
    draw();
}

function getSong(song){
    source = acontext.createBufferSource();
    var request=new XMLHttpRequest();
    request.open('GET',song,true);
    request.responseType='arraybuffer';
    request.onload= function(){
        var audio=request.response;
        acontext.decodeAudioData(audio, function(buffer){
            source.buffer=buffer;
            source.connect(acontext.destination);
        });
    }
    request.send();
}


function playSong(k){
    getSong(songs[k]);
    source.connect(analyser);
    source.start();
    source.onended=function(){
        if(k+1<=songs.length)
            playSong(k+1);
    }
}

var canvas = document.getElementById("visualizer");
var ctx = canvas.getContext('2d');

var a_increment=360/256;
var center= 250;
var minRad= 100;
var maxRad=110;
var firstPt=false;
function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0,1000,400);
    ctx.beginPath();
    var l=dataArray.length;
    while(l-1>=0){
        var ang=(l*a_increment*Math.PI)/180;
        var radius= minRad + dataArray[l]*(maxRad-minRad)/210;
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

