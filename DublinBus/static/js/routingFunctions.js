
/**
 * Sets the starting point to the marker clicked
 * @param data is the name of the station clicked on
 */
function routeFromHere(data) {
    document.getElementById('origin-input').value = data;
}

/**
 * Routes from the current location of the user to the selected marker
 *
 * @param location which is the location of the stop
 */
function routeToHere(location) {
    var pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
            var geocoder = new google.maps.Geocoder;
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var latlngStr = lat.toString() + "," + long.toString();
            latlngStr = latlngStr.split(',', 2);
            var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === 'OK') {
                    var start = results[0].formatted_address;
                    buildDateTime(0, start, location);
                } else {
                    alert("Something went wrong. Try again!")
                }
            });
        }, function () {
            handleLocationError(true, LocationWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, LocationWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, LocationWindow, pos) {
        LocationWindow.setPosition(pos);
        LocationWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        LocationWindow.open(map);
    }
}

//removes line created for route
function removeLine() {
    for (var i = 0; i < polylines.length; ++i) {
        polylines[i].setMap(null);
    }
    polylines = [];
    return false;
}


function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//CALL THIS TO REMOVE MARKERS FROM MAP, IT USES THE OTHER MARKER RELATED FUNCTIONS!
function deleteMarkers() {
    clearMarkers();
    markers = [];
}



// Snap a user-created polyline to roads and draw the snapped path
function runSnapToRoad(path) {
    var pathValues = [];
    for (var i = 0; i < path.getLength(); i++) {
        pathValues.push(path.getAt(i).toUrlValue());
    }

    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: 'AIzaSyC-hR-mSsuP9TGDFilrtWVmxNR_t1i-qYo',
        path: pathValues.join('|')
    }, function (data) {
        processSnapToRoadResponse(data);
        drawSnappedPolyline();
    });
}

// Store snapped polyline returned by the snap-to-road service.
function processSnapToRoadResponse(data) {
    snappedCoordinates = [];
    placeIdArray = [];
    for (var i = 0; i < data.snappedPoints.length; i++) {
        var latlng = new google.maps.LatLng(
            data.snappedPoints[i].location.latitude,
            data.snappedPoints[i].location.longitude);
        snappedCoordinates.push(latlng);
        placeIdArray.push(data.snappedPoints[i].placeId);
    }
}

// Draws the snapped polyline (after processing snap-to-road response).
function drawSnappedPolyline() {
    var snappedPolyline = new google.maps.Polyline({
        path: snappedCoordinates,
        strokeColor: 'black',
        strokeWeight: 3
    });

    snappedPolyline.setMap(map);
    polylines.push(snappedPolyline);
}