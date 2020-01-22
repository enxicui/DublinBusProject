/**
 * The find location function gets the current location of the user, and then finds the closest stations (0.6 km or less away)
 *
 */

function myLocation() {
    console.log("made it here again");
}

/**
 * Finds the location of any stop within .6 km of the user's current location. If no location permission is given, returns
 * an InfoWindow which says that an error has occurred in the geolocation service.
 */
function findLocation() {
    var icon = {
        url: '../static/img/iconsmarker1.png', // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
    };
    var pos;
    var infowindow = new google.maps.InfoWindow();
    //uses the Google geolocation service
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
            //marker where the user is
            /* var marker = new google.maps.Marker({
                 position: pos,
                 map: map,
             });*/
            //load the stops info from the JSON file

            $.getJSON("../static/files/stops_info.json", function (data) {

                for (var i = 0; i < data.length; i++) {
                    //get the position of each stop in the file
                    var destPos = new google.maps.LatLng(data[i].latitude, data[i].longitude);
                    //if the stop in the file is less than 0.6 km away from the user, show it on the map.
                    //info window contains all the info in the content section of the marker.
                    if (distance(data[i].latitude, data[i].longitude, position.coords.latitude, position.coords.longitude) < .6) {
                        var marker = new google.maps.Marker({
                            position: destPos,
                            map: map,
                            icon: icon,
                            animation: google.maps.Animation.DROP,
                            title: data[i].actual_stop_id + "\n" + data[i].stop_name,
                            // content is the stop info
                            content: '<div id="content' + data[i].actual_stop_id + '" >' +
                                '<div id=stop' + data[i].actual_stop_id + '>' +
                                "<div><img src='../static/img/bus-blue-icon.png' alt='bus-blue-icon' width='12%' height='12%'>" +
                                '<h6 style="margin-left: 3%; font-family:Tangerine; font-size:15px;">Stop ID: ' + data[i].actual_stop_id + '</h6></div>' +
                                '<h style="margin-left: 15%; font-family:Tangerine; font-size:15px;"><b>Stop name:</b><br>' + '<p style="margin-left: 8%">' + data[i].stop_name + '</p></h>' +
                                '<button class = "btn btn-primary "id="realtime" onclick="get_real_time_data2(' + data[i].actual_stop_id + ')">' +
                                '<p id="realtime_p" style="font-family:Tangerine; font-size:12px;">Real Time Info</p>' +
                                '</button>' +
                                '<button class = "btn btn-primary" id="fromHere" onclick="routeFromHere(\'' + data[i].stop_name + '\')">' +
                                '<p style="font-family:Tangerine; font-size:12px;">Route From Here</p>' +
                                '</button>' +
                                '</div>'
                        });
                        markers.push(marker);
                        //add an on click for the markers
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(marker.content);
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    }
                }
            });
        }, function () {
            handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infowindow, pos) {
        infowindow.setPosition(pos);
        infowindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infowindow.open(map);
    }
}


//distance calculator between two latitudes and longitudes.
function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1.609344;
    }
}