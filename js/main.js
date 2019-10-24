var initPoint = [50.858445, 38.394921];
var initDone= false;
var mymap = L.map('mapid');

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWx5YXBldHJvdiIsImEiOiJjazE0MHo2ZnUwZGhsM2JtOTR4NGYweXN0In0.2SddUDwyUnihjtu6fkzR4Q', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 20,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiaWx5YXBldHJvdiIsImEiOiJjazE0MHo2ZnUwZGhsM2JtOTR4NGYweXN0In0.2SddUDwyUnihjtu6fkzR4Q'
}).addTo(mymap);

function getUrlParams(search) {
    let hashes = search.slice(search.indexOf('?') + 1).split('&')
    let params = {}
    hashes.map(hash => {
        let [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })

    return params
}
var googleSheetKey = getUrlParams(document.location.search)['googleSheetKey'];
if(googleSheetKey === undefined){
	alert("Невозможно получить доступ к google-таблице!");
}

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

function isNum(x){
    return !isNaN(parseInt(x));
}

var points = [];
function getMaxLatLng(points){
    let maxLat = points[1][0];
    let maxLng = points[1][1];
    for(var i=1; i<points.length; i++){
        if(points[i][0]>maxLat && isNum(points[i][0])) maxLat = points[i][0];
        if(points[i][1]>maxLng && isNum(points[i][1])) maxLng = points[i][1];
    }
    return [maxLat,maxLng];
}
function getMinLatLng(points){
    let minLat = points[1][0];
    let minLng = points[1][1];
    for(var i=1; i<points.length; i++){
        if(points[i][0]<minLat && isNum(points[i][0])) minLat = points[i][0];
        if(points[i][1]<minLng && isNum(points[i][1])) minLng = points[i][1];
    }
    return [minLat,minLng];
}
function drawPoints(data){
    console.log(data);
	for(var i=1; i<data.length; i++){
	    if(data[i][0] == '' || data[i][1] == '') continue;
		points.push(new AudioPoint(data[i][0], data[i][1], data[i][2]));
		points[i-1].addAudio(data[i][3]);
	}
	
	mymap.fitBounds([
        getMinLatLng(data),
        getMaxLatLng(data)
    ]);
	
	for(var i=0; i<points.length; i++){
		L.marker(points[i].coords).addTo(mymap);
	}
	initDone = true;
}
function loadData() {
        var url = "https://sheets.googleapis.com/v4/spreadsheets/" + googleSheetKey + "/values/A:D?key=AIzaSyA8o23YY060J9v-1C9cui_YkX_b9C9k2wg";
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4) {
            dataTable = JSON.parse(xmlhttp.responseText);
			if(dataTable.majorDimension === "ROWS"){
			    if(dataTable.values.length > 1){ 
				    drawPoints(dataTable.values);
			    }else{
			        alert('В таблице слишком мало данных. Добавьте хотя бы одну строчку с координатами.');
			    }
			}
          }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }


function getNearPoint(p, pts){
    var minIdx = 0;
    for(var i=0; i<pts.length; i++ ){
        if(p.distanceTo(pts[minIdx].coords) > p.distanceTo(pts[i].coords)){
            minIdx = i;
        }
    }
    return pts[minIdx];
}

var near = new AudioPoint(0,0);

function onMoveEnd(e){
    if(!initDone) return;
    var center = mymap.getCenter();
    near.stop();
    near = getNearPoint(center,points);
    near.play(); 
}
loadData();
mymap.on('moveend', onMoveEnd);
