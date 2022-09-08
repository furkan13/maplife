let popupContent
let currentLocation
let followingUserId=[]
const categoryElements= document.getElementsByName('cat-group-chips')
const resetButtonElement = document.getElementById("reset-filter-btn")
const streamNowButtonElement = document.getElementById("live-switch")
const subscriptionButtonElement = document.getElementById("sub-switch")
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
var orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = orangeIcon

// define a marker cluster group to support heat map and Compatibility with layers
var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({spiderLegPolylineOptions:{opacity: 0},showCoverageOnHover:false}),
    petGroup = L.layerGroup(), lifeGroup = L.layerGroup(), gameGroup = L.layerGroup(), sportGroup = L.layerGroup(),travelGroup = L.layerGroup(),otherGroup = L.layerGroup(),
    upcomingGroup = L.layerGroup(),unfollowingGroup= L.layerGroup(),
    control = L.control.layers(null, null, { collapsed: false }),
    categoryGroupList = [gameGroup,petGroup,lifeGroup,sportGroup,travelGroup,otherGroup]
    // switchLiveGroupList = [upcomingGroup,liveNowGroup]
mcgLayerSupportGroup.addTo(map);
//retrieve and show the streaming event data
const getEvents = async function () {
    if (headerButtonLogged.style.display==="flex"){


        const response1 = await fetch("/api/getFollowingUserId")
        if (response1.status == "200"){
            followingUserId = await response1.json();
            console.log("Subscriptions' Ids",followingUserId);
        }
    }
    const response = await fetch("/EventList")
    if (response.status == "200") {
        const data = await response.json();
        console.log(data);
        let roomLink;
        //resolve data and put them in our marker and popup
        for (let i = 0;data.length>i;i++) {
            if (data[i].live===true){
                roomLink = "/live?room="+ data[i].title
            }

            else if (data[i].live===false){
                roomLink = "/profile/"+ data[i].user.username
            }

            let time = strToDate(data[i].event_date)
            //define the custom icon for hosts
            let myIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});
            //custom the popup and icon for hosts
            popupContent = `<a href="${roomLink}"><div id="event-img-container" style="background-image: url('../../..${data[i].photosImagePath}')"></div><div id="event-title">${data[i].title}</div>
                            <div id="host-name" class="event-text">${data[i].user.username}</div><div id="event-viewers" class="event-text">${data[i].user.views} viewers</div><div class="event-text">${time}</div></a>`
            myIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= "image/${data[i].user.icon}">`
            const marker = L.marker([data[i].latitude,data[i].longitude], {icon: myIcon}).bindPopup(popupContent,{closeButton:false})
            let category =  data[i].cat.split(",");
            console.log(data[i].title,category)
            //add unfollowed hosts' events to a group
            if (followingUserId.indexOf(data[i].user.user_id)===-1){
                unfollowingGroup.addLayer(marker)
            }
            //add upcomming events to a group
            if(data[i].live===false){
                upcomingGroup.addLayer(marker)
            }
            for (let j=0;j<category.length;j++){
                    switch (category[j]){
                        case "Other":
                            otherGroup.addLayer(marker)
                            break
                        case "Pet":
                            petGroup.addLayer(marker)
                            break
                        case "Game":
                            gameGroup.addLayer(marker)
                            break
                        case "Life":
                            lifeGroup.addLayer(marker)
                            break
                        case "Sport":
                            sportGroup.addLayer(marker)
                            break
                        case "Travel":
                            travelGroup.addLayer(marker)
                            break
                    }
            }
        }
    } else {
        console.log("Get events not 200");
    }
}

//show mock data
let mockData = []
for (let i=0;i<50;i++){
    let dummyItem = {'host_name':'Cat Lover','event_title':'My life with cats','event_description':'','event_cover':'cat.png','event_viewer':'1000','host_icon':'cat.png','category':'Pet',lat:48.8 + 0.1 * Math.random(),lng:2.25 + 0.2 * Math.random()}
    let dummyItem2 = {'host_name':'Bird life','event_title':'Do you know these birds?','event_description':'','event_cover':'birds.jpg','event_viewer':'1000','host_icon':'birds.jpg','category':'Pet',lat:48.8 + 0.1 * Math.random(),lng:2.25 + 0.2 * Math.random()}
    mockData.push(dummyItem,dummyItem2)
}
for (let i = 0;mockData.length>i;i++) {
    let mockIcon = L.divIcon({className:'custom-div-icon',iconAnchor: [25, 25],popupAnchor: [2, -28]});
    let mockEventCoverImg = "image/" + mockData[i].event_cover
    let mockEventIconImg = "image/" + mockData[i].host_icon
    mockPopupContent = `<div id="event-img-container" style="background-image: url(${mockEventCoverImg})"></div><div id="event-title">${mockData[i].event_title}</div>
<div id="host-name" class="event-text">${mockData[i].host_name}</div><div id="event-viewers" class="event-text">${mockData[i].event_viewer} viewers</div><div class="event-text">47 minutes ago</div>`
    mockIcon.options.html = `<img id="custom-div-icon" class="custom-div-icon" src= ${mockEventIconImg}>`
    // determine the category and put them into different layer groups
        L.marker([mockData[i].lat,mockData[i].lng], {icon: mockIcon}).bindPopup(mockPopupContent,{closeButton:false}).addTo(otherGroup) ;
}

var filterSidebar = L.control.sidebar('filter-sidebar', {
    position: 'left',
    autoPan:true
});
map.addControl(filterSidebar);

//toggle button for map filter
L.easyButton('filter-button',function(){
    filterSidebar.toggle();
}).setPosition('bottomright').addTo(map);

//location search
const distanceRangeInput= document.getElementById("distance-range")
const distanceRangeLabel= document.getElementById("distance-range-value")
let radius = 1000 * distanceRangeInput.value
var distanceCircle = L.circle()
var geocoder = L.Control.geocoder({
    collapsed:false,
    defaultMarkGeocode: false,
    placeholder:"Search Places...",
})
    .on('markgeocode', function(e) {
        map.removeLayer(distanceCircle);
        var center = e.geocode.center;
        distanceCircle = L.circle(center,{radius:radius,color:"#de5b19",fillOpacity: 0.1,opacity: 0.8}).addTo(map)
        map.fitBounds(distanceCircle.getBounds(),{paddingTopLeft:[288,0]});
    })
    .addTo(map);
const searchLocationBar = geocoder.getContainer()
const searchLocationBarContainer = document.getElementById("location-search-bar")
const searchbarInput = document.getElementsByClassName("leaflet-control-geocoder-form")[0].firstChild
const searchbarOuter = document.getElementsByClassName("leaflet-control-geocoder")[0]
searchbarInput.addEventListener("focus",()=>{
    searchbarOuter.style.setProperty('border', '1px solid #de5b19', 'important')
    searchbarOuter.style.setProperty('box-shadow', '0 0 0 0.25rem rgb(222 91 25 / 25%)', 'important')
})
searchbarInput.addEventListener("blur",()=>{
    searchbarOuter.style.setProperty('border', '1px solid #ced4da', 'important')
    searchbarOuter.style.setProperty('box-shadow', 'none', 'important')
})
searchLocationBarContainer.replaceWith(searchLocationBar)

distanceRangeLabel.innerText=distanceRangeInput.value
distanceRangeInput.oninput=function (){
    radius = 1000 * distanceRangeInput.value
    distanceRangeLabel.innerHTML=distanceRangeInput.value
    distanceCircle.setRadius(radius)
}
distanceRangeInput.onchange=function (){
    try{
        map.fitBounds(distanceCircle.getBounds(),{paddingTopLeft:[288,0]});
    }
    catch (e) {
        console.log("circle is not created")
    }
}

//convert datetime
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
//function for clear all conditions in map filter
let clearAll = function () {
    document.getElementById('distance-range-value').innerHTML='50'
    mcgLayerSupportGroup.addLayer(categoryGroupList)
}
//check the streaming now and subscription switch button status
let isLiveNow = function (){
    return !!streamNowButtonElement.checked;
}
let isSubOnly = function (){
    return !!subscriptionButtonElement.checked;
}
//To filter all conditions and control the layer groups
let filter =  function () {
    mcgLayerSupportGroup.removeLayers(categoryGroupList)
    let checkedCategories = checkCategories()
    mcgLayerSupportGroup.addLayers(checkedCategories)

    if (isLiveNow()===true){
        mcgLayerSupportGroup.removeLayer(upcomingGroup)
    }
    if (isSubOnly()===true){
        mcgLayerSupportGroup.removeLayer(unfollowingGroup)
    }
    console.log("These categories are checked",checkedCategories)
    console.log("Streaming now is ON",isLiveNow())
    console.log("Subscription Only is ON",isSubOnly())

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
    unfollowingGroup.addTo(map)
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
    unfollowingGroup.clearLayers()
    mcgLayerSupportGroup.clearLayers()
    getEvents().then(showEventsOnMap)},30000)

/* EventListeners */
resetButtonElement.addEventListener("click",clearAll)
streamNowButtonElement.addEventListener("click", filter)
subscriptionButtonElement.addEventListener("click", filter)

//add listeners to bind checkbox and category layers
for (let i = 0; i < categoryElements.length; i++) {
 categoryElements[i].addEventListener("click",filter)
}

