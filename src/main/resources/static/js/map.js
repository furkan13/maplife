let popupContent
let currentLocation
const categoryElements= document.getElementsByName('cat-group-chips')
categoryElements.checked=true;
// display the map layer
var map = L.map('map',{zoomControl:false}).setView([51.483396, -3.173728], 11);
//render map tile layer
L.tileLayer('https://api.maptiler.com/maps/voyager/256/{z}/{x}/{y}@2x.png?key=qnH9hX4XM6EYJA7JoXVH',{
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 19,
    minZoom: 1,
    attribution: "\u003ca href=\"https://carto.com/\" target=\"_blank\"\u003e\u0026copy; CARTO\u003c/a\u003e \u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);
//zoom controller
L.control.zoom({position:'topright'}).addTo(map);
// load and zoom to the current location controller
var displayCurrentLocation = L.control.locate({
    position:'bottomright',
    markerStyle:{fillColor:'#de5b19'},
    compassStyle:{fillColor:'#de5b19'},
    circleStyle:{fillColor:'#de5b19'},
    initialZoomLevel:15,
    keepCurrentZoomLevel:true,
    setView:'untilPanOrZoom',
    clickBehavior:{inView: 'setView', outOfView: 'setView', inViewNotFollowing: 'inView'},
    flyTo:true,
    icon:'relocate',
}).addTo(map);
displayCurrentLocation.start({setView:false}) //load location as soon as load the page
//set the current location latitude and longitude to sessionStorage
function getCurrentLocation(e) {
    currentLocation = e.latlng
    let currentLat =  currentLocation.lat
    let currentLng = currentLocation.lng
    console.log(currentLocation)
    sessionStorage.setItem('lat',currentLat)
    sessionStorage.setItem('lng',currentLng)
}
map.on('locationfound', getCurrentLocation);

//customize the default marker
// var orangeIcon = new L.Icon({
//     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
// })
// L.Marker.prototype.options.icon = orangeIcon

//define the custom icon
var myIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});

//retrieve the streaming data
var data = [
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Game',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Game',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Life',lat:51.483392,lng:-3.173728},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'1000','host_icon':'birds.jpg','category':'Pet',lat:51.480023,lng:-3.170290},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'20','host_icon':'birds.jpg','category':'Pet',lat:51.485923,lng:-3.175390},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'30000','host_icon':'birds.jpg','category':'Pet',lat:51.481023,lng:-3.155490},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'2000','host_icon':'birds.jpg','category':'Game',lat:51.487023,lng:-3.170190},
]
// define a marker cluster group to support heat map and Compatibility with layers
var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({spiderLegPolylineOptions:{opacity: 0},showCoverageOnHover:false}),
    petGroup = L.layerGroup(),
    lifeGroup = L.layerGroup(),
    gameGroup = L.layerGroup(),
    control = L.control.layers(null, null, { collapsed: false })

mcgLayerSupportGroup.addTo(map);

//resolve data and put them in our marker and popup
for (let i = 0;data.length>i;i++) {
    let eventCoverImg = "image/" + data[i].event_cover
    let eventIconImg = "image/" + data[i].host_icon
    popupContent = `<div id="event-img-container" style="background-image: url(${eventCoverImg})"></div><div id="event-title">${data[i].event_title}</div>
<div id="host-name" class="event-text">${data[i].host_name}</div><div id="event-viewers" class="event-text">${data[i].event_viewer} viewers</div><div class="event-text">47 minutes ago</div>`
    myIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= ${eventIconImg}>`
    // determine the category and put them into different layer groups
    if (data[i].category === 'Pet'){
        L.marker([data[i].lat,data[i].lng], {icon: myIcon,tags:['Pet']}).bindPopup(popupContent,{closeButton:false}).addTo(petGroup) ;
    }
    else if (data[i].category === 'Life'){
        L.marker([data[i].lat,data[i].lng], {icon: myIcon,tags:['Life']}).bindPopup(popupContent,{closeButton:false}).addTo(lifeGroup);
    }
    else if (data[i].category === 'Game'){
        L.marker([data[i].lat,data[i].lng], {icon: myIcon,tags:['Game']}).bindPopup(popupContent,{closeButton:false}).addTo(gameGroup);
    }
}
var subGroupList = [gameGroup,petGroup,lifeGroup]
mcgLayerSupportGroup.checkIn(subGroupList); //check in these groups
//add to control layers
control.addOverlay(petGroup, 'Pet');
control.addOverlay(lifeGroup, 'Life');
control.addOverlay(gameGroup, 'Game');
control.addTo(map);
petGroup.addTo(map); // Adding to map or to AutoMCG are now equivalent.
lifeGroup.addTo(map);
gameGroup.addTo(map);

var filterSidebar = L.control.sidebar('filter-sidebar', {
    position: 'left',
    autoPan:false
});
map.addControl(filterSidebar);

L.easyButton('filter-button',function(){
    filterSidebar.toggle();
}).setPosition('bottomright').addTo(map);

// setTimeout(function () {
//     filterSidebar.show();
// }, 500);

for (let i = 0; i < subGroupList.length; i++) {
    categoryElements[i].addEventListener("click",toggleGroup)}

function toggleGroup(i) {
    for (i=0;i<=subGroupList.length;i++){
        if (categoryElements[i].checked){
            mcgLayerSupportGroup.addLayer(subGroupList[i])
        }
        else {
            mcgLayerSupportGroup.removeLayer(subGroupList[i])
        }
    }
}
