var map = L.map('map').fitWorld();
map.locate({setView: true, maxZoom: 16});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);
map.on('locationfound', onLocationFound);

// var popup = L.popup();
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }
//
// map.on('click', onMapClick);

//customize the marker
// var MapIcon = L.Icon.extend({
//     options: {
//         // shadowUrl: 'image/cat.png',
//         iconSize: [60, 60],
//         // shadowSize: [0, 0],
//         iconAnchor: [30, 30],
//         // shadowAnchor: [4, 62],
//         popupAnchor: [0, -40]
//     }
// });
// // var catIcon = new LeafIcon({iconUrl: 'image/cat.png'}),
// //     birdIcon = new LeafIcon({iconUrl: 'image/birds.jfif'});
// var catIcon = new MapIcon({iconUrl: '../../static/image/cat.png'}),
//     birdIcon = new MapIcon({iconUrl: '../../static/image/birds.jfif'});
// L.icon = function (options) {
//     return new L.Icon(options);
// };
// L.marker([51.483396, -3.173728], {icon: catIcon}).addTo(map).bindPopup("I am a cat.");
// L.marker([51.489566, -3.187325], {icon: birdIcon}).addTo(map).bindPopup("I am a bird.");

var myIcon = L.divIcon({className: 'custom-div-icon'});
L.marker([51.483396, -3.173728], {icon: myIcon}).addTo(map).bindPopup("I am a cat.");

