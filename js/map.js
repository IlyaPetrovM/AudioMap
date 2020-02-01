var G_API = "AIzaSyA8o" + "23YY060J9v-1C"+"9cui_YkX_b9C9k2wg";
var OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
var OSM_ATTR = 'Map data <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a>' + ' contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | &copy; Петров Илья | <a href="http://derevni-sela.ru">Фонд &quot;Электронная энциклопедия истории и культуры русских сёл и деревень&quot;</a>';

var initPoint = [50.858445, 38.394921];
var initDone= false;
var map = L.map('mapid');

/*
Сделано:
+ Ввод данных с учётом названий заголовков таблицы
+ Ввод координат только в одном столбце
+ Поддержка старых таблиц
+ Конвертирование адреса на гугл-диск в прямой
*/


L.tileLayer(OSM_URL, { 
	maxZoom: 18, 
	attribution: OSM_ATTR 
}).addTo(map);



var googleSheetKey = getUrlParams(document.location.search)['googleSheetKey'];
console.log(googleSheetKey);
if(googleSheetKey === undefined){
	alert("Невозможно получить доступ к google-таблице!");
}
function createItem(title, val){
	let s = '<div class=descr><div class=title>'+title+'</div><div class=val>' + val+'</div></div>';
	return s;
}

function AudioPoint(lat,lng, title, url,etc){
    this.coords = L.latLng(lat,lng);
    this.title = title;
	if(etc) {
		this.title += '<div class=etc>'; 
		if(etc['ARTIST']!==undefined && etc['ARTIST']!=='') this.title = this.title + createItem('Исполнитель',etc['ARTIST']);
		if(etc['OPERATOR']!==undefined && etc['OPERATOR']!=='') this.title = this.title + createItem('Оператор',etc['OPERATOR']);
		if(etc['ARCHIVE']!==undefined && etc['ARCHIVE']!=='') this.title = this.title + createItem('Владелец архива',etc['ARCHIVE']);
		if(etc['COUNTRY']!==undefined && etc['COUNTRY']!=='') this.title = this.title + createItem('Страна',etc['COUNTRY']);
		if(etc['REGION']!==undefined && etc['REGION']!=='') this.title = this.title + createItem('Район',etc['REGION']);
		if(etc['PLACE']!==undefined && etc['PLACE']!=='') this.title = this.title + createItem('Населённый пункт',etc['PLACE']);
		this.title += '</div>'; 
	}
	if(url!==undefined){
		let _path = url;
		console.log('fileId:',url);
		if(url.includes('drive.google.com/open?id=')){// Пытаемся переделать ссылку на гугл диск
			let fileId = getTableId(url);
			_path = 'https://drive.google.com/uc?export=download&id='+fileId;
		}
		this.audioPath = new Audio(_path);
	}
}
AudioPoint.prototype.stop = function(){
    this.audioPath.pause();
}
AudioPoint.prototype.play = function(){
    var pop = L.popup()
		.setLatLng(this.coords)
		.setContent(this.title)
		.openOn(map);
    var _this = this;
    map.on('popupclose', function() {_this.stop();});
    // if(this.audioPath.length>0){
        this.audioPath.play();
    // }
}

function isNum(x){
    return !isNaN(parseInt(x));
}

var points = [];
function getMaxLatLng(points){
    let maxLat = points[0].coords.lat;
    let maxLng = points[0].coords.lng;
    for(var i=1; i<points.length; i++){
        if(points[i].coords.lat>maxLat && isNum(points[i].coords.lat)) maxLat = points[i].coords.lat;
        if(points[i].coords.lng>maxLng && isNum(points[i].coords.lng)) maxLng = points[i].coords.lng;
    }
    return [maxLat,maxLng];
}
function getMinLatLng(points){
    let minLat = points[0].coords.lat;
    let minLng = points[0].coords.lng;
    for(var i=1; i<points.length; i++){
        if(points[i].coords.lat<minLat && isNum(points[i].coords.lat)) minLat = points[i].coords.lat;
        if(points[i].coords.lng<minLng && isNum(points[i].coords.lng)) minLng = points[i].coords.lng;
    }
    return [minLat,minLng];
}

function drawPoints(data){
    console.log(data);
	let COORDS = undefined, TITLE= undefined, URL = undefined;
	for(let i=0;i<data[0].length;i++){
		if (data[0][i].includes('COORDS')) COORDS = i;
		if (data[0][i].includes('TITLE')) TITLE = i;
		if (data[0][i].includes('URL')) URL = i;
		if (data[0][i].includes('ARTIST')) var ARTIST = i;
		if (data[0][i].includes('OPERATOR')) var OPERATOR = i;
		if (data[0][i].includes('ARCHIVE')) var ARCHIVE = i;
		if (data[0][i].includes('COUNTRY')) var COUNTRY = i;
		if (data[0][i].includes('REGION')) var REGION = i;
		if (data[0][i].includes('PLACE')) var PLACE = i;
	}
	
	if(COORDS === undefined){
		console.warn('Не найдены стандартные заголовки таблицы. Интерпертируем её как старую версию');
		for(let i=1; i<data.length; i++){
			if(data[i][0] == '') continue;
			let ap = new AudioPoint(data[i][0], data[i][1], data[i][2],data[i][3]);
			points.push(ap);
		}
	}else{
		for(let i=2; i<data.length; i++){
			if(data[i][COORDS] == '') continue;
			let etc = {'ARTIST':data[i][ARTIST],
			'OPERATOR':data[i][OPERATOR],
			'ARCHIVE':data[i][ARCHIVE],
			'COUNTRY':data[i][COUNTRY],
			'REGION':data[i][REGION],
			'PLACE':data[i][PLACE]};
			let latlang = data[i][COORDS].split(',');
			let ap = new AudioPoint(parseFloat(latlang[0]), parseFloat(latlang[1]), data[i][TITLE], data[i][URL],etc);
			points.push(ap);
		}
	}
		
	map.fitBounds([
        getMinLatLng(points),
        getMaxLatLng(points)
    ]);
	
	for(var i=0; i<points.length; i++){
		L.marker(points[i].coords).addTo(map);
	}
	initDone = true;
}
function loadData() {
	
        let url = "https://sheets.googleapis.com/v4/spreadsheets/" + googleSheetKey + "/values/A:Z?key="+G_API;
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

var near = new AudioPoint(0,0,'','hello');

function onMoveEnd(e){
    if(!initDone) return;
    var center = map.getCenter();
    near.stop();
    near = getNearPoint(center,points);
    near.play(); 
}
loadData();
map.on('moveend', onMoveEnd);
