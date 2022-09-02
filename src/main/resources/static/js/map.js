let popupContent
let currentLocation
const categoryElements= document.getElementsByName('cat-group-chips')
const resetButtonElement = document.getElementById("reset-filter-btn")

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



//retrieve and show the streaming event data
const showEventsOnMap = async function () {
        const response = await fetch("/EventList")
        if (response.status == "200") {
            const data = await response.json();
            console.log(data);
            //resolve data and put them in our marker and popup
            for (let i = 0;data.length>i;i++) {
                //define the custom icon for hosts
                let myIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});
                //custom the popup for hosts
                popupContent = `<div id="event-img-container" style="background-image: url('../../../${data[i].photosImagePath}')"></div><div id="event-title">${data[i].title}</div>
<div id="host-name" class="event-text">${data[i].user.username}</div><div id="event-viewers" class="event-text">${data[i].user.views} viewers</div><div class="event-text">${data[i].event_date}</div>`
                myIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= "image/${data[i].user.icon}">`
                // determine the category and put them into different layer groups
                // if (data[i].category === 'Pet'){
                    L.marker([51,-3], {icon: myIcon,tags:['Pet']}).bindPopup(popupContent,{closeButton:false}).addTo(petGroup) ;
                    mcgLayerSupportGroup.checkIn(subGroupList);
                // }
                }
        } else {
            console.log("get events not 200");
        }
    }

// define a marker cluster group to support heat map and Compatibility with layers
var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({spiderLegPolylineOptions:{opacity: 0},showCoverageOnHover:false}),
    petGroup = L.layerGroup(),
    lifeGroup = L.layerGroup(),
    gameGroup = L.layerGroup(),
    control = L.control.layers(null, null, { collapsed: false })

mcgLayerSupportGroup.addTo(map);

//show mock data
var mockData = [
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Game',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Game',lat:51.485923,lng:-3.175390},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.483396,lng:-3.173728},
    {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Life',lat:51.483392,lng:-3.173728},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'1000','host_icon':'birds.jpg','category':'Pet',lat:51.480023,lng:-3.170290},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'20','host_icon':'birds.jpg','category':'Pet',lat:51.485923,lng:-3.175390},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'30000','host_icon':'birds.jpg','category':'Pet',lat:51.481023,lng:-3.155490},
    {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'2000','host_icon':'birds.jpg','category':'Game',lat:51.487023,lng:-3.170190},
]
for (let i = 0;mockData.length>i;i++) {
    let mockIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});
    let mockEventCoverImg = "image/" + mockData[i].event_cover
    let mockEventIconImg = "image/" + mockData[i].host_icon
    mockPopupContent = `<div id="event-img-container" style="background-image: url(${mockEventCoverImg})"></div><div id="event-title">${mockData[i].event_title}</div>
<div id="host-name" class="event-text">${mockData[i].host_name}</div><div id="event-viewers" class="event-text">${mockData[i].event_viewer} viewers</div><div class="event-text">47 minutes ago</div>`
    mockIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= ${mockEventIconImg}>`
    // determine the category and put them into different layer groups
    if (mockData[i].category === 'Pet'){
        L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon,tags:['Pet']}).bindPopup(mockPopupContent,{closeButton:false}).addTo(petGroup) ;
    }
    else if (mockData[i].category === 'Life'){
        L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon,tags:['Life']}).bindPopup(mockPopupContent,{closeButton:false}).addTo(lifeGroup);
    }
    else if (mockData[i].category === 'Game'){
        L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon,tags:['Game']}).bindPopup(mockPopupContent,{closeButton:false}).addTo(gameGroup);
    }
}

var subGroupList = [gameGroup,petGroup,lifeGroup]
mcgLayerSupportGroup.checkIn(subGroupList); //check in these groups

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

//functions for bind checkbox and layers
for (let i = 0; i < subGroupList.length; i++) {
    categoryElements[i].addEventListener("click",function (){
        if (event.currentTarget.checked){
            mcgLayerSupportGroup.addLayer(subGroupList[i])
        }
        else {
            mcgLayerSupportGroup.removeLayer(subGroupList[i])
        }
    })}

//function for clear all conditions in map filter
let clearAll = function () {
    document.getElementById('distance-range-value').innerHTML='50'
    mcgLayerSupportGroup.addLayer(subGroupList)
}
resetButtonElement.addEventListener("click",clearAll)
setTimeout(showEventsOnMap, 500);
