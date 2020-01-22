/** This function does a few things. First, we loop through all the sections of the route selected (walking, bus). If the
 /* section is a bus section, all the stops are looped through and counted so we can tell the user how many stops there
 /* are, and we also collect the latitudes and longitudes for each stop and add the markers for the map.
 /*
 /* @param i targets the specific route that the user wants to get directions for.
 /* @param url for the API hit we want to do.
 /* @param start the start position for the user
 /* @param end the end position for the user
 */
function getRoute(i, url, start, end, predictDate, predictTime) {
    var startEndTimes = [];
    var origWalk;
    var addTime=0;
    var estTime = document.getElementById("time"+i).innerHTML;
    estTime = estTime.replace ( /[^\d.]/g, '' );
    estTime = parseInt(estTime, 10);
    document.getElementById('header').innerHTML = "";
    document.getElementById('routes').innerHTML = "";
    document.getElementById('options').style.display = "block";
    document.getElementById('map').style.display = "block";
    document.getElementById('options').innerHTML =
        "<div id = 'return' style='text-align: center'><button class='btn btn-primary' " +
        "type='submit' onclick = 'removeLine(); deleteMarkers();mobileMapReturnHide();" +
        "mobileGetLatLng(\"" + start + "\",\"" + end + "\",\"" + predictTime + "\",\"" + predictDate + "\")'>Return to Results</button>" +
        "</div>" +
        "<br>" +
        "<h3 style = 'text-align: center;'> Directions </h3>";
    map.setZoom(12);
    if (busPath !== undefined) {
        removeLine();
    }
    deleteMarkers();
//    document.getElementById('directions').style.height = "700px";
//    document.getElementById('directions').style.display = "block";
    start = start.replace("&#39;", "");
    end = end.replace("&#39;", "");

    var infowindow = new google.maps.InfoWindow();
    //array I'll use store locations
    var locations = [];
    var times = [];
    var km = 0;
    //hit the HERE api for route
    xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //loop through each section of the route
            var returnData = JSON.parse(this.responseText);
            var firstLayerJSON = returnData['Res']['Connections']["Connection"];
            var indivBusRouteJSON = firstLayerJSON[i]["Sections"]["Sec"];
            for (var x = 0; x < indivBusRouteJSON.length; x++) {


                if (indivBusRouteJSON[x]["mode"] == 20 && x != indivBusRouteJSON.length - 1) {
                    if (x == 0) {
                        origWalk=new Date(indivBusRouteJSON[x]["Dep"]['time']);
                        var endWalk = new Date(indivBusRouteJSON[x]["Arr"]['time']);

                        var timeWalked = (endWalk-origWalk)/(1000*60);
                        startEndTimes.push(timeWalked);
                    }
                    else {
                        origWalk=new Date(indivBusRouteJSON[x]["Dep"]['time']);
                        endWalk = new Date(indivBusRouteJSON[x]["Arr"]['time']);
                        timeWalked = (endWalk-origWalk)/(1000*60);
                        startEndTimes.push(timeWalked);
                    }
                    // Hours part from the timestamp
                    var origWalkHours = origWalk.getHours();
                    // Minutes part from the timestamp
                    var origWalkMinutes = "0" + origWalk.getMinutes();
                    // Seconds part from the timestamp
                    var finalFormTime = origWalkHours + ':' + origWalkMinutes.substr(-2);
                    if (x == 0) {
                        document.getElementById('options').insertAdjacentHTML('beforeend',
                            "<img src='../static/img/walk.png' style='width:32px;height:32px'>" +
                            "<div style='margin-left:3%; padding-left: 5%; border-left: 5px dotted black'><p>Walk to " +
                            indivBusRouteJSON[x]["Arr"]["Stn"]["name"] + ", leaving at " + finalFormTime + "<p>" + indivBusRouteJSON[x]["Journey"]['distance'] + " meters</p><hr></div>");
                    }
                    else {
                        document.getElementById('options').insertAdjacentHTML('beforeend',
                            "<img src='../static/img/walk.png' style='width:32px;height:32px'>" +
                            "<div style='margin-left:3%; padding-left: 5%; border-left: 5px dotted black'><p>Walk to " +
                            indivBusRouteJSON[x]["Arr"]["Stn"]["name"] + ", walking about " + timeWalked + " minutes.</p> <p>" + indivBusRouteJSON[x]["Journey"]['distance'] + " meters</p><hr></div>");
                    }
                } else if (indivBusRouteJSON[x]['mode'] == 5) {
                    if (x == 0) {
                        origWalk= new Date(indivBusRouteJSON[x]["Dep"]['time']);
                    }
                    var insertHTML = "<img src='../static/img/bus.png' style='width:28px;height:28px; margin-bottom: 2%'>" +
                        "<div style='margin-left:3%; padding-left: 5%;border-left: 5px solid black'><p>Take bus number " + indivBusRouteJSON[x]["Dep"]["Transport"]["name"] +
                        " toward " + indivBusRouteJSON[x]["Dep"]["Transport"]["dir"] + " from station " +
                        indivBusRouteJSON[x]["Dep"]["Stn"]["name"] + " to station " + indivBusRouteJSON[x]["Arr"]["Stn"]["name"] +
                        "</p><p>" + indivBusRouteJSON[x]["Journey"]['Stop'].length + " stops</p>";
                    if (x == indivBusRouteJSON.length - 1) {
                        addTime += estTime;
                        var newDateObj = new Date(origWalk.getTime() + (addTime * 60000));
                        // Create a new JavaScript Date object based on the timestamp
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                        var timeDate = new Date(newDateObj);
                        // Hours part from the timestamp
                        var timeHours = timeDate.getHours();
                        // Minutes part from the timestamp
                        var timeMinutes = "0" + timeDate.getMinutes();
                        // Seconds part from the timestamp
                        var timeSeconds = "0" + timeDate.getSeconds();
                        var finalFormattedTime = timeHours + ':' + timeMinutes.substr(-2);
                        insertHTML += "<br>You should reach at " + finalFormattedTime + "</div><hr>";
                    }
                    else {
                        insertHTML += "</div><hr>";
                    }
                    document.getElementById('options').insertAdjacentHTML('beforeend', insertHTML);

                    for (var z = 0; z < indivBusRouteJSON[x]["Journey"]["Stop"].length; z++) {

                        var hold = indivBusRouteJSON[x]["Journey"]["Stop"][z]["Stn"];
                        hold.longitude = parseFloat(hold.x);
                        hold.latitude = parseFloat(hold.y);
                        delete hold.x;
                        delete hold.y;
                        closest = closestLocation(hold, stopData);
                        if (z < indivBusRouteJSON[x]["Journey"]["Stop"].length - 1) {
                            var nextLat = indivBusRouteJSON[x]["Journey"]["Stop"][z + 1]["Stn"]["y"];
                            var nextLong = indivBusRouteJSON[x]["Journey"]["Stop"][z + 1]["Stn"]["x"];
                            km += distance(closest.latitude, closest.longitude, nextLat, nextLong);
                        }
                        var time = indivBusRouteJSON[x]["Journey"]["Stop"][z]["dep"];
                        var depArr = "depart";
                        if (time === undefined) {
                            time = indivBusRouteJSON[x]["Journey"]["Stop"][z]["arr"];
                            depArr = "arrive";
                        }
                        time = new Date(time);
                        var minutes = time.getMinutes();
                        var hours = time.getHours();
                        var name = closest.stop_name;
                        var latitude = parseFloat(closest.latitude);
                        var longitude = parseFloat(closest.longitude);
                        locations.push({
                            lat: latitude,
                            lng: longitude,
                            name: name,
                            actual_stop_id: closest.actual_stop_id
                        });
                        times.push({minutes: minutes, hours: hours})
                    }
                    var icon = {
                        url: '../static/img/iconsmarker1.png', // url
                        scaledSize: new google.maps.Size(40, 40), // scaled size
                        origin: new google.maps.Point(0, 0), // origin
                    };
                    var co2 = Math.round(km * 70);
                    var carCo2 = Math.round(km * 127);
                    var diff = carCo2 - co2;
                    if (typeof user !== 'undefined') {
                        var myNewXmlHttp = new XMLHttpRequest();
                        myNewXmlHttp.open("POST", "addCO2", true);
                        myNewXmlHttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        myNewXmlHttp.send("co2=" + diff + "&user=" + user);
                        myNewXmlHttp.onreadystatechange = function () {
                            if (this.responseText == 400) {
                                alert("Something went wrong, we weren't able to log your co2 savings! Our apologies.")
                            }
                        }
                    }
                    var newCenter = new google.maps.LatLng(locations[0].lat, locations[0].lng);
                    map.panTo(newCenter);
                    //go through all the entries in our array and create markers from them, and then create
                    //onClick windows for each marker.
                    for (var a = 0; a < locations.length; a++) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[a].lat, locations[a].lng),
                            content: '<div id="content' + locations[a].actual_stop_id + '" >' +
                                '<div id=stop' + locations[a].actual_stop_id + '>' +
                                "<div><img src='../static/img/bus-blue-icon.png' alt='bus-blue-icon' width='12%' height='12%'>" +
                                '<h6 style="margin-left: 3%; font-family:Tangerine; font-size:15px;">Stop ID: ' + locations[a].actual_stop_id + '</h6></div>' +
                                '<h style="margin-left: 15%; font-family:Tangerine; font-size:15px;"><b>Stop name:</b><br>' + '<p style="margin-left: 8%">' + locations[a].name + '</p></h>' +
                                '<button id="realtime" onclick="get_real_time_data(' + locations[a].actual_stop_id + ')">' +
                                '<p id="realtime_p" style="font-family:Tangerine; font-size:12px;">Real Time Info</p>' +
                                '</button>' +
                                '</div>',
                            map: map,
                            animation: google.maps.Animation.DROP,
                            icon: icon
                        });
                        markers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function (marker, a) {
                            return function () {
                                infowindow.setContent('<div class="infowin">' + this.content + '</div>');
                                infowindow.open(map, marker);
                            }
                        })(marker, a));
                    }
                    //if its the last direction in the route, add a return to results button.
                } else if (indivBusRouteJSON[x]["mode"] == 20 && x == indivBusRouteJSON.length - 1) {
                    let startWalk=new Date(indivBusRouteJSON[x]["Dep"]['time']);
                    let endWalk = new Date(indivBusRouteJSON[x]["Arr"]['time']);
                    timeWalked = (endWalk-startWalk)/(1000*60);
                    startEndTimes.push(timeWalked);
                    var geocoder = new google.maps.Geocoder;
                    var lat = indivBusRouteJSON[x]["Arr"]["Addr"]["y"];
                    var long = indivBusRouteJSON[x]["Arr"]["Addr"]["x"];
                    var latlngStr = lat.toString() + "," + long.toString();
                    latlngStr = latlngStr.split(',', 2);
                    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
                    geocoder.geocode({'location': latlng}, function (results, status) {
                        if (status === 'OK') {
                            if (startEndTimes.length >= 1) {
                                for (var e = 0; e < startEndTimes.length; e++) {
                                    addTime+=startEndTimes[e];
                                }
                            }
                            addTime += estTime;
                            var newDateObj = new Date(origWalk.getTime() + (addTime * 60000));
                            // Create a new JavaScript Date object based on the timestamp
                            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                            var date = new Date(newDateObj);
                            // Hours part from the timestamp
                            var hours = date.getHours();
                            // Minutes part from the timestamp
                            var minutes = "0" + date.getMinutes();
                            // Seconds part from the timestamp
                            var seconds = "0" + date.getSeconds();
                            var formattedTime = hours + ':' + minutes.substr(-2);
                            document.getElementById('options').insertAdjacentHTML('beforeend',
                                "<img src='../static/img/walk.png' style='width:32px;height:32px';>" +
                                "<div id = 'finalWalk' style='margin-left:3%; padding-left: 5%; border-left: 5px dotted black'><p>You'll have to walk " + timeWalked + " minutes, but you'll get there around " + formattedTime + "</p></div>"
                            );
                        }
                    })
                }
            }
            //building the line based on the locations of stops
            busPath = new google.maps.Polyline({
                path: locations,
                geodesic: true,
                strokeColor: 'black',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            var path = busPath.getPath();
            polylines.push(busPath);
            runSnapToRoad(path);

        }
    }
}