var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWx5YXBldHJvdiIsImEiOiJjazE0MHo2ZnUwZGhsM2JtOTR4NGYweXN0In0.2SddUDwyUnihjtu6fkzR4Q', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiaWx5YXBldHJvdiIsImEiOiJjazE0MHo2ZnUwZGhsM2JtOTR4NGYweXN0In0.2SddUDwyUnihjtu6fkzR4Q'
}).addTo(mymap);


var popup = L.popup();
function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(mymap);
    
}
function onMoveEnd(e){
    var center = mymap.getCenter();
    popup
		.setLatLng(center)
		.setContent("You moved the map center at " + center.toString())
		.openOn(mymap);
}

mymap.on('moveend', onMoveEnd);