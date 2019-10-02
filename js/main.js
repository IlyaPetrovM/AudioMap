var initPoint = [50.858445, 38.394921];
var mymap = L.map('mapid').setView(initPoint, 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWx5YXBldHJvdiIsImEiOiJjazE0MHo2ZnUwZGhsM2JtOTR4NGYweXN0In0.2SddUDwyUnihjtu6fkzR4Q', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 5,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiaWx5YXBldHJvdiIsImEiOiJjazE0MHo2ZnUwZGhsM2JtOTR4NGYweXN0In0.2SddUDwyUnihjtu6fkzR4Q'
}).addTo(mymap);

function AudioPoint(lat,lng, title){
    this.coords = L.latLng(lat,lng);
    this.title = title;
    this.audioPath = [];
//    mymap.on('moveend', this.stop);
}
AudioPoint.prototype.addAudio = function(path){
    this.audioPath.push(new Audio(path));
}
AudioPoint.prototype.stop = function(){
    if(this.audioPath.length>0) {this.audioPath[0].pause()};
}
AudioPoint.prototype.play = function(){
    var pop = L.popup()
		.setLatLng(this.coords)
		.setContent(this.title)
		.openOn(mymap);
    var _this = this;
    mymap.on('popupclose', function() {_this.stop();});
    if(this.audioPath.length>0){
        this.audioPath[0].play();
    }
}



var points = [
    new AudioPoint(50.858445, 38.394921, 'село Большебыково'),
    new AudioPoint(43.493550, 45.879331,'станица Червлёная'),
    new AudioPoint(51.099681, 35.330480,'село Плёхово'),
    new AudioPoint(66.509812, 36.375499,'село Варзуга')
];
points[0].addAudio('media/bolsheb.mp3');
points[1].addAudio('media/chervlenaya.mp3');
points[2].addAudio('media/plehovo.mp3');
points[3].addAudio('media/varzuga.mp3');

function getNearPoint(p, pts){
    var minIdx = 0;
    for(var i=0; i<pts.length; i++ ){
        if(p.distanceTo(pts[minIdx].coords) > p.distanceTo(pts[i].coords)){
            minIdx = i;
        }
    }
    return pts[minIdx];
}

for(var i=0; i<points.length; i++){
    L.marker(points[i].coords).addTo(mymap);
}

var near = new AudioPoint(0,0);
function onMoveEnd(e){
    var center = mymap.getCenter();
    near.stop();
    near = getNearPoint(center,points);
    near.play();   
}
//mymap.on('moveend', AudioPoint.stop);

mymap.on('moveend', onMoveEnd);