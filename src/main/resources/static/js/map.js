let popupContent

// display the map layer
var map = L.map('map').fitWorld();
map.locate({setView: true, maxZoom: 16}); // ask for the current location

//render map tile layer
L.tileLayer('https://api.maptiler.com/maps/voyager/256/{z}/{x}/{y}@2x.png?key=qnH9hX4XM6EYJA7JoXVH',{
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 19,
    minZoom: 1,
    attribution: "\u003ca href=\"https://carto.com/\" target=\"_blank\"\u003e\u0026copy; CARTO\u003c/a\u003e \u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
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
var myIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});

//retrieve the streaming data
var data = [
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'event_description_test','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png',lat:51.483396,lng:-3.173728},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'event_description_test','event_cover':'birds.jfif','event_viewer':'1000','host_icon':'birds.jfif',lat:51.480023,lng:-3.170290},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'event_description_test','event_cover':'birds.jfif','event_viewer':'20','host_icon':'birds.jfif',lat:51.485923,lng:-3.175390},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'event_description_test','event_cover':'birds.jfif','event_viewer':'30000','host_icon':'birds.jfif',lat:51.481023,lng:-3.155490},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'event_description_test','event_cover':'birds.jfif','event_viewer':'2000','host_icon':'birds.jfif',lat:51.487023,lng:-3.170190},
]

//resolve data and put them in our marker and popup
for (let i = 0;data.length>i;i++){
    let eventCoverImg = "image/" + data[i].event_cover
    let eventIconImg = "image/" + data[i].host_icon
    popupContent = '<div id="event-img-container" style="background-image: url(' + eventCoverImg + ')"></div><div id="event-title">' +
        data[i].event_title + "</div><div id='host-name' class='event-text'>" + data[i].host_name + "</div><div id='event-viewers' class='event-text'>" +
        data[i].event_viewer + " viewers</div><div class='event-text'>47 minutes ago</div>"
    myIcon.options.html = '<img id="custom-div-icon" class="custom-div-icon" src=' + eventIconImg + ">"
    //put the marker on the map, bind the popup
    L.marker([data[i].lat,data[i].lng], {icon: myIcon}).addTo(map).bindPopup(popupContent,{closeButton:false});
}


