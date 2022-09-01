let popupContent
let mockPopupContent
let currentLocation
const categoryElements= document.getElementsByName('cat-group-chips')
const resetButtonElement = document.getElementById("reset-filter-btn")
const streamNowButtonElement = document.getElementById("live-switch")

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

// define a marker cluster group to support heat map and Compatibility with layers
var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({spiderLegPolylineOptions:{opacity: 0},showCoverageOnHover:false}),
    petGroup = L.layerGroup(), lifeGroup = L.layerGroup(), gameGroup = L.layerGroup(), sportGroup = L.layerGroup(),travelGroup = L.layerGroup(),otherGroup = L.layerGroup(),
    liveNowGroup = L.layerGroup(), upcomingGroup = L.layerGroup(),
    control = L.control.layers(null, null, { collapsed: false })

mcgLayerSupportGroup.addTo(map);
var categoryGroupList = [gameGroup,petGroup,lifeGroup,sportGroup,travelGroup,otherGroup]
// var switchLiveGroupList = [upcomingGroup,liveNowGroup]
//retrieve and show the streaming event data
const getEvents = async function () {
    const response = await fetch("/EventList")
    if (response.status == "200") {
        const data = await response.json();
        console.log(data);
        //resolve data and put them in our marker and popup
        for (let i = 0;data.length>i;i++) {
            let time = strToDate(data[i].event_date)
            //define the custom icon for hosts
            let myIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});
            //custom the popup and icon for hosts
            popupContent = `<div id="event-img-container" style="background-image: url('../../../${data[i].photosImagePath}')"></div><div id="event-title">${data[i].title}</div>
<div id="host-name" class="event-text">${data[i].user.username}</div><div id="event-viewers" class="event-text">${data[i].user.views} viewers</div><div class="event-text">${time}</div>`
            myIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= "image/${data[i].user.icon}">`
            const marker = L.marker([51.583396,-3.273728], {icon: myIcon}).bindPopup(popupContent,{closeButton:false})
            let category =  data[i].cat.split(",");
            console.log(data[i].title,category)
            // console.log(data[i].event_date)
            for (let j=0;j<category.length;j++){
                switch (category[j]){
                    case "Other":
                        otherGroup.addLayer(marker)
                        if(data[i].live===false){
                            upcomingGroup.addLayer(marker)
                        }   break
                    case "Pet":
                        petGroup.addLayer(marker)
                        if(data[i].live===false){
                            upcomingGroup.addLayer(marker)
                        }   break
                        // else if (data[i].live===true){
                        //     liveNowGroup
                        //  }
                    case "Game":
                        gameGroup.addLayer(marker)
                        if(data[i].live===false){
                            upcomingGroup.addLayer(marker)
                        }   break
                    case "Life":
                        lifeGroup.addLayer(marker)
                        if(data[i].live===false){
                            upcomingGroup.addLayer(marker)
                        }   break
                    case "Sport":
                        sportGroup.addLayer(marker)
                        if(data[i].live===false){
                            upcomingGroup.addLayer(marker)
                        }   break
                    case "Travel":
                        travelGroup.addLayer(marker)
                        if(data[i].live===false){
                            upcomingGroup.addLayer(marker)
                        }   break
                }
            }

        }
    } else {
        console.log("get events not 200");
    }
}

//show mock data
// var mockData = [
//     {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.583396,lng:-3.173728},
//     {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.683396,lng:-3.173728},
//     {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Game',lat:51.683396,lng:-3.173728},
//     {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Game',lat:51.685923,lng:-3.175390},
//     {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:51.683396,lng:-3.173728},
//     {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Life',lat:51.683392,lng:-3.173728},
//     {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'1000','host_icon':'birds.jpg','category':'Pet',lat:51.680023,lng:-3.170290},
//     {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'20','host_icon':'birds.jpg','category':'Pet',lat:51.685923,lng:-3.175390},
//     {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'30000','host_icon':'birds.jpg','category':'Pet',lat:51.681023,lng:-3.155490},
//     {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'2000','host_icon':'birds.jpg','category':'Game',lat:51.687023,lng:-3.170190},
// ]
// for (let i = 0;mockData.length>i;i++) {
//     let mockIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});
//     let mockEventCoverImg = "image/" + mockData[i].event_cover
//     let mockEventIconImg = "image/" + mockData[i].host_icon
//     mockPopupContent = `<div id="event-img-container" style="background-image: url(${mockEventCoverImg})"></div><div id="event-title">${mockData[i].event_title}</div>
// <div id="host-name" class="event-text">${mockData[i].host_name}</div><div id="event-viewers" class="event-text">${mockData[i].event_viewer} viewers</div><div class="event-text">47 minutes ago</div>`
//     mockIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= ${mockEventIconImg}>`
//     // determine the category and put them into different layer groups
//     if (mockData[i].category === 'Pet'){
//         L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon}).bindPopup(mockPopupContent,{closeButton:false}).addTo(petGroup) ;
//     }
//     else if (mockData[i].category === 'Life'){
//         L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon}).bindPopup(mockPopupContent,{closeButton:false}).addTo(lifeGroup);
//     }
//     else if (mockData[i].category === 'Game'){
//         L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon}).bindPopup(mockPopupContent,{closeButton:false}).addTo(gameGroup);
//     }
// }

var filterSidebar = L.control.sidebar('filter-sidebar', {
    position: 'left',
    autoPan:false
});
map.addControl(filterSidebar);

L.easyButton('filter-button',function(){
    filterSidebar.toggle();
}).setPosition('bottomright').addTo(map);

//function for clear all conditions in map filter
let clearAll = function () {
    document.getElementById('distance-range-value').innerHTML='50'
    mcgLayerSupportGroup.addLayer(categoryGroupList)
}

//check the streaming now switch button status
let isLiveNow = function (){
    return !!streamNowButtonElement.checked;
}
//To filter all conditions and control the layer groups
let filter =  function () {
    mcgLayerSupportGroup.removeLayers(categoryGroupList)
    let checkedCategories = checkCategories()
    mcgLayerSupportGroup.addLayers(checkedCategories)
    if (isLiveNow()===true){
        mcgLayerSupportGroup.removeLayer(upcomingGroup)
    }
    console.log("These categories are checked",checkedCategories)
    console.log("Streaming now is ON",isLiveNow())
}
//To check which categories are selected
let checkCategories =   function () {
    let checkedCategories = []
    for (let i = 0; i < categoryElements.length; i++) {
        if (categoryElements[i].checked) {
            checkedCategories.push(categoryGroupList[i])
        }
    }
    return checkedCategories;
}

//add everything to the map
let showEventsOnMap= function (){
    // Adding to map or to AutoMCG are now equivalent.
    upcomingGroup.addTo(map)
    petGroup.addTo(map);
    lifeGroup.addTo(map);
    otherGroup.addTo(map);
    gameGroup.addTo(map);
    sportGroup.addTo(map);
    travelGroup.addTo(map);
    filter();
}

getEvents().then(showEventsOnMap)

//polling every 30 seconds to refresh the markers
setInterval(() => {
    clearInterval(this)
    travelGroup.clearLayers()
    sportGroup.clearLayers()
    petGroup.clearLayers()
    lifeGroup.clearLayers()
    otherGroup.clearLayers()
    gameGroup.clearLayers()
    upcomingGroup.clearLayers()
    mcgLayerSupportGroup.clearLayers()
    getEvents().then(showEventsOnMap)},30000)

/* EventListeners */
resetButtonElement.addEventListener("click",clearAll)
streamNowButtonElement.addEventListener("click", filter)
//add listeners to bind checkbox and category layers
for (let i = 0; i < categoryElements.length; i++) {
 categoryElements[i].addEventListener("click",filter)
}
let str2 = "2022-09-01T00:00:00.000+00:00"

let strToDate= function (str){
    let nowTime = new Date().getTime();
    let eventTime = new Date(str).getTime();
    if (nowTime>=eventTime){
        let totalSeconds = (nowTime - eventTime)/1000
        // let days = parseInt(totalSeconds/86400); // day  24*60*60*1000
        let hours = parseInt(totalSeconds/3600)    // hours 60*60 whole hours-past hours= current hours
        let minutes = parseInt(totalSeconds/60)-60*hours; // minutes - hours*60 = minutes left
        let seconds = parseInt(totalSeconds%60);  // mod 60 so the seconds left
        return  hours+" hours "+minutes+" minutes ago"
    }
    else {
        let date = new Date(eventTime);
        let Year = date.getFullYear();
        let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let Second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return  Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute  + ':' + Second;
    }

}