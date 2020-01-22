/**
 * Called to set the desktop map up
 */
function initMap() {
    var infowindow = new google.maps.InfoWindow();
    var pos;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    // The location of Dublin
    var dublin = {lat: 53.33306, lng: -6.24889};
    // The map, centered at Uluru
    var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: dublin,
        mapTypeControl: false,
    });
    directionsDisplay.setMap(map);
    //uses the Google geolocation service
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: im
            });
            map.setCenter(pos);
        });
    }
    autocompSearchBar();
    setAutocomplete();
    // The marker, positioned at Uluru
    addMarker(map);

}

/**
 * This function sets up the autocomplete for the origin and destination fields
 */
function setAutocomplete() {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    //define a center and circle for our autocomplete search, this makes it so that it's biased toward this area when
    //searching for a place name
    var center = new google.maps.LatLng(53.33306, -6.24889);
    var circle = new google.maps.Circle({
        center: center,
        radius: 10000
    });
    //setting up the autcomplete and adding the bound circle of 10KM for suggestions
    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    originAutocomplete.setBounds(circle.getBounds());
    destinationAutocomplete.setBounds(circle.getBounds());
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    var marker = new google.maps.Marker({position: dublin, map: map});

}

/**
 * This sets up the main search bar's autocomplete
 */
function autocompSearchBar() {

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        newMarkers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(142, 142),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50)
            };
            var location = document.getElementById("pac-input").value;
            myMark = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                content: '<button onclick = "routeToHere(\'' + location + '\')" class = "btn-primary">Route to here</button></div>'
            });
            // Create a marker for each place.
            newMarkers.push(myMark);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            google.maps.event.addListener(myMark, 'click', (function (myMark) {
                return function () {
                    infowindow.setContent(myMark.content);
                    infowindow.open(map, myMark);
                }
            })(myMark));
        });
        map.fitBounds(bounds);

    });
}

/**
 * Populate the map with markers
 * @param map
 */
function addMarker(map) {
    for (var i = 0, length = data.length; i < length; i++) {
        var busdata = data[i];
        var myLatLng = {lat: parseFloat(busdata.stop_lat), lng: parseFloat(busdata.stop_lon)};

        // Creating  markers and putting it on the map

        // {#var image = 'https://image.flaticon.com/icons/svg/164/164955.svg';#}
        // {#var image = "{% static '../../static/img/bus.png' %}";#}
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: busdata.actual_stop_id + "\n" + busdata.stop_name,
            // {#icon: image,#}

        });

    }
}

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
                    getLatLng(start, location);
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
    busPath.setMap(null);
}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

/**
 * Called to delete any markers from the map. Only works if the markers are added to the marker array. Calls clearMarkers
 */
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

/**
 * sets the map back to original position, resets the side bar to the 'search dublin' option
 */
function resetMap() {
    document.getElementById('directions').style.display = "none";
    document.getElementById('options').style.width='300px';
    document.getElementById('options').style.height = "200px";
    document.getElementById('options').innerHTML =
        "<div id = 'journeyPlan' style = 'display:none'>\n" +
        "            <h5 style=\"text-align: center\">Start your journey here!</h5>\n" +
        "            <br>\n" +
        "            <h6 style=\"text-align: center\">Enter a start and end location!</h6>\n" +
        "\n" +
        "            <div style=\"text-align: center\">\n" +
        "\n" +
        "                <input autocomplete=\"off\" style= \"text-align: center\" class=\"controls\" id=\"origin-input\" placeholder=\"Enter an origin location\"\n" +
        "                       type=\"text\">\n" +
        "\n" +
        "                <input autocomplete=\"off\" style= \"text-align: center\" class=\"controls\" id=\"destination-input\" placeholder=\"Enter a destination location\"\n" +
        "                       type=\"text\">\n" +
        "\n" +
        "            </div>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' id=\"directionsButton\" onclick=\"resizeMap()\" type=\"submit\">Search\n" +
        "                </button>\n" +
        "            </div>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' id=\"locationButton\" onclick=\"findLocation()\" type=\"submit\">Find Stations\n" +
        "                    Near Me!\n" +
        "                </button>\n" +
        "            </div>\n" +
        "            <br>\n" +
        "            <br>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' onclick=\"hideOptions()\" type=\"submit\">Hide Options ^</button>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div id = 'searchOnly' style = 'display:block'>\n" +
        "            <div style=\"text-align: center\">\n" +
        "            <h5>Search for a place in Dublin to visit!</h5>\n" +
        "                <input autocomplete=\"off\" style= \"text-align: center\" class=\"controls\" id=\"pac-input\" placeholder=\"Search Dublin\" type=\"text\" autocomplete = 'off'>\n" +
        "                <br>\n" +
        "                <br>\n" +
        "                <button class='btn btn-primary' style= \"text-align: center\" onclick=\"showOptions()\" type=\"submit\">Show Journey Planner</button>\n" +
        "            </div>\n" +
        "</div>";
    autocompSearchBar();
    setAutocomplete();


}


/**
 * resizes map for directions on the right side
 */
function resizeMap() {
    deleteMarkers();
    // console.log("resizing map function")
    var start = document.getElementById('origin-input').value;
    var end = document.getElementById('destination-input').value;

    document.getElementById('options').style.padding = "3%";
    // document.getElementById('options').style.height="26vh";

    // document.getElementById('lowerholder').style.height = "33vh";


    if (start == "" || end == "") {
        document.getElementById("options").innerHTML = "<h6 style = 'text-align: center'>Please enter a start and end location!</h6>" +
            "<div style = 'text-align: center'>" +
            "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'resetMap()'>Try Again</button> " +
            "</div>";
    } else {
        var columns_container = $(".dynamic-columns");
        if (!columns_container.hasClass("expanded")) {

            $(".dynamic-columns .col:first-child").removeClass("col-2");
            $(".dynamic-columns .col:first-child").addClass("col-3");

            $(".dynamic-columns .col:last-child").removeClass("col-10");
            $(".dynamic-columns .col:last-child").addClass("col-9");

            columns_container.toggleClass("expanded");
        }
        getLatLng(start, end);
    }
}

/**
 * If you click 'show journey planner'
 */
function showOptions() {
    // document.getElementById('header').innerHTML = '<p>Plan your journey!</p>';
    document.getElementById('searchOnly').style = 'display:none';
    document.getElementById('options').style.height = "500px";
    document.getElementById('journeyPlan').style = 'display:block';
}

/**
 * if you click 'hide options'
 */
function hideOptions() {
    // document.getElementById('header').innerHTML = '<p>Search for a place to go!</p>';
    document.getElementById('journeyPlan').style = 'display:none';
    document.getElementById('options').style.height = "200px";
    document.getElementById('searchOnly').style = 'display:block';
}