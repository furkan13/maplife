let popupContent = document.getElementById("marker-popup")

// display the map layer
var map = L.map('map').fitWorld();
map.locate({setView: true, maxZoom: 16}); // ask for the current location
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng,{radius:radius,color:'#de5b19'}).addTo(map);
}
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);
map.on('locationfound', onLocationFound);

//customize the default marker
var orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = orangeIcon

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }
//
// map.on('click', onMapClick);


//define the custom icon
var myIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [3, -30]});

//retrieve the streaming data
var data = [
    {'event_title':'Cat Lover','event_description':'My life with cats','event_cover':'cat.png','event_icon':'cat.png',lat:51.483396,lng:-3.173728},
    {'event_title':'Bird life','event_description':'Do you know the birds?','event_cover':'birds.jfif','event_icon':'birds.jfif',lat:51.480023,lng:-3.170290}
]

//put the marker on the map
for (let i = 0;data.length>i;i++){
    let eventCoverImg = "../../static/image/" + data[i].event_cover
    let eventIconImg = "../../static/image/" + data[i].event_icon
    popupContent = "<h1>" + data[i].event_title + "<h1><img id='event-img' src=" + eventCoverImg + ">"
    myIcon.options.html = '<img id="custom-div-icon" class="custom-div-icon" src=' + eventIconImg + ">"
    L.marker([data[i].lat,data[i].lng], {icon: myIcon}).addTo(map).bindPopup(popupContent);
}
// L.marker([51.483396, -3.173728], {icon: myIcon}).addTo(map).bindPopup(popupContent);
// marker.bindPopup(popupContent).openPopup(popup);


