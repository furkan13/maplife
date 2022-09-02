

    var geocoder = new google.maps.Geocoder();
    var marker = null;
    var map = null;
    function initialize() {
    var $lat = document.getElementById('lat');
    var $longi = document.getElementById('longi');
    var lat = sessionStorage.getItem('lat');
    var longi = sessionStorage.getItem('lng');
        $lat.value = lat;
         $longi.value =longi;


    var zoom = 16;

    var LatLng = new google.maps.LatLng(lat, longi);

    var mapOptions = {
    zoom: zoom,
    center: LatLng,
    panControl: false,
    zoomControl: false,
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
}

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    if (marker && marker.getMap) marker.setMap(map);
    marker = new google.maps.Marker({
    position: LatLng,
    map: map,
    title: 'Drag Me!',
    draggable: true
});

    google.maps.event.addListener(marker, 'dragend', function(marker) {
    var latLng = marker.latLng;
    $lat.value = latLng.lat();
    $longi.value = latLng.lng();
});


}
    initialize();


    function codeAddress() {
    var address = document.getElementById('address').value;


    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    map.setCenter(results[0].geometry.location);
    var marker = new google.maps.Marker({
    map: map,

    position: results[0].geometry.location,

});




    google.maps.event.addListener(marker, 'dragend', function (event) {
    document.getElementById("lat").value = this.getPosition().lat();
    document.getElementById("longi").value = this.getPosition().lng();
});
} else {
        if (marker && marker.getMap) marker.setMap(map);
        marker = new google.maps.Marker({
            position: LatLng,
            map: map,
            title: 'Drag Me!',
            draggable: true
        });
}
});
}


    function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    map.setCenter(results[0].geometry.location);
    var marker = new google.maps.Marker({
    map: map,
    position: results[0].geometry.location
});
    document.getElementById("lat").value = marker.getPosition().lat();
    document.getElementById("longi").value = marker.getPosition().lng();

    google.maps.event.addListener(marker, 'dragend', function (event) {
    document.getElementById("lat").value = this.getPosition().lat();
    document.getElementById("longi").value = this.getPosition().lng();
});
} else {
    alert('Geocode was not successful for the following reason: ' + status);
}
});
}





