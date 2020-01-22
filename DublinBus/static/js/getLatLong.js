/**
 *  The getLatLng() function is the first one called in the setting up of the directions window. The function gets the start
 * and end points off of the input boxes, and then calls the Google Geocode Service to get latitude and longitudes for each
 * spot. From there, it calls the HERE Transit API, which will provide a list of routes and directions between the
 * two latitude and longitude points. The function then tells the user which bus lines are possible between two points
 * and also indicates how many connections each route has. This also calls the getPrediction() function, which handles calling
 * the backend prediction models.
 *
 * @param start the starting location of the route
 * @param end the ending location of the route
 * @param time is the time chosen by the user
 * @param predictDate is the date at which the user wants to take the route
 */
function getLatLng(start, end, time, predictDate) {
    var errorFlag = false;
    document.getElementById('options').style.height = "600px";

    start = start.replace("&#39;", "");
    end = end.replace("&#39;", "");

    //set the HTML for the routes list
    //start and end points
    document.getElementById('options').innerHTML = "<h5 style='text-align: center; padding-bottom: 5%;'>Possible Routes</h5>";
    var dublin = {lat: 53.33306, lng: -6.24889};
    map.panTo(dublin);
    //Two geocoders, one for the start and one for end
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    geocoder.geocode({'address': start}, function (results, status) {
        if (status == 'OK') {
            var loc = results[0].geometry.location;
            startLat = loc.lat();
            startLong = loc.lng();
        } else {
            document.getElementById('options').insertAdjacentHTML('beforeend',
                "<h3>Sorry, no results were found. Perhaps you searched a start or end location that doesn't make sense. Or maybe it's the routing service/computer's fault!</h3>" +
                "Whatever it is, we'll make sure it doesn't happen again." +
                "<hr><div style='text-align: center'><button class=" +
                "'btn btn-primary' type='submit' onclick = 'removeLine();deleteMarkers();resetMap();'>Search Again</button></div>")
            errorFlag = true;
        }
        geocoder2.geocode({'address': end}, function (results, status) {
            if (status == 'OK') {
                //locations are stored in a variable called results. results[0] is the most accurate one, the list
                //results get less accurate as you go down, so if you looked at results[1], it'll be less specific
                var loc = results[0].geometry.location;
                destLat = loc.lat();
                destLong = loc.lng();
                //new xhttp request to get the data from the HERE api
                xhttp = new XMLHttpRequest();
                var date = new Date();
                date = date.toISOString();
                var datearr = predictDate.split('/');
                var newDate = datearr[2] + "-" + datearr[0] + "-" + datearr[1];
                var newTime = newDate + "T" + time + ":00+01:00";
                var finalNewTime = new Date(newTime);
                try {
                    finalNewTime = finalNewTime.toISOString();
                }
                catch (e) {
                    document.getElementById('options').innerHTML = "<br><br>Sorry, there was an error in the processing " +
                        "of your request. Please try again. Check that all your inputs are valid and make sense." +
                        "<div style='text-align: center'><button class=" +
                    "'btn btn-primary' type='submit' onclick = 'removeLine();deleteMarkers();resetMap();'>Search Again</button>";
                }
                var url = "https://transit.api.here.com/v3/route.json?app_id=tL7r9QKJ3KlE5Kc9LGYo&app_code=1arMc" +
                    "SHt_o31xFSeBRswsA&modes=bus&routing=all&dep=" + startLat + "," + startLong + "&arr=" + destLat +
                    "," + destLong + "&time=" + finalNewTime;
                xhttp.open("GET", url, true);
                xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                //xhttp.setRequestHeader('X-CSRF-Token', 'abcdef');
                xhttp.send();
                xhttp.onreadystatechange = async function () {
                    if (this.readyState === 4 && this.status === 200) {
                        if (this.responseText != "") {
                            //parsing this awful JSON. follow the url if you want to see how the JSON looks
                            var returnData = JSON.parse(this.responseText);
                            document.getElementById('options').insertAdjacentHTML('beforeend',
                                '<div id = "header" class="row">' +
                                '<div style = "text-align: center"  id = "route" class="col-2">' +
                                '<b>Route</b>' +
                                '</div>' +
                                '<div style = "text-align: center"  id = "direction" class="col-3">' +
                                '<b>Towards</b>' +
                                '</div>' +
                                '<div style = "text-align: center"  id = "time" class="col-3">' +
                                '<b>Est. Journey Time</b>' +
                                '</div>' +
                                '<div style = "text-align: center"  id = "connections" class="col-4">' +
                                '<b>Connections</b>' +
                                '</div></div>'
                            );
                            document.getElementById('options').insertAdjacentHTML('beforeend', '<div id = "possRoutes">');
                            var parseMe = returnData['Res']['Connections']["Connection"];
                            for (var i = 0; i < parseMe.length; i++) {
                                var myHTML = "";
                                var parsed = parseMe[i]["Sections"]["Sec"];
                                var connections = 0;
                                for (var x = 0; x < parsed.length; x++) {
                                    //mode == 5 means that it's a bus traveled method
                                    if (parsed[x]['mode'] == 5) {
                                        connections++;
                                        if (connections == 1) {
                                            var name = parsed[x]['Dep']['Transport']['name'];
                                            var direction = parsed[x]['Dep']['Transport']['dir'];
                                            myHTML += "<hr>";
                                            start = start.replace("'", "");
                                            end = end.replace("'", "");
                                            myHTML += '<div  style="cursor: pointer;" class = "row" id ="' + i + '" onclick = "getRoute(' + i + ', \'' + url + '\', \'' + start + '\', \'' + end + '\')">' +
                                                '<div style = "text-align: center" class = "col-2">' + name + '</div>' +
                                                '<div style= "text-align: center"  class = "col-3">' + direction + '</div>' +
                                                '<div id = "time' + i + '" style = "text-align: center"  class = "col-3">Processing...</div>';
                                            document.getElementById('possRoutes').insertAdjacentHTML('beforeend', myHTML);
                                            getPrediction(i, url, start, end, predictDate, time);
                                            await sleep(500);
                                        }
                                    }
                                }
                                //calculate time
                                //let the user know how many connections required per route.
                                if (connections == 1) {
                                    document.getElementById(i.toString()).insertAdjacentHTML('beforeend', '<div style = "text-align: center"  class = "col-4"> No connections </div>');
                                } else if (connections > 1) {
                                    document.getElementById(i.toString()).insertAdjacentHTML('beforeend', '<div style = "text-align: center"  class = "col-4">' + (connections - 1) + ' Connections</div>');
                                }
                                await sleep(200);
                            }
                            //option to reset the searches
                            document.getElementById('options').insertAdjacentHTML('beforeend', "<hr><div style='text-align: center'><button class=" +
                                "'btn btn-primary' type='submit' onclick = 'removeLine();deleteMarkers();resetMap();'>Search Again</button></div>");
                        } else {
                            if (errorFlag == false) {
                                document.getElementById('options').insertAdjacentHTML('beforeend',
                                    "<h3>Sorry, no results were found. Perhaps you searched a start or end location that doesn't make sense. Or maybe it's the routing service/computer's fault!</h3>" +
                                    "Whatever it is, we'll make sure it doesn't happen again." +
                                    "<hr><div style='text-align: center'><button class=" +
                                    "'btn btn-primary' type='submit' onclick = 'removeLine();deleteMarkers();resetMap();'>Search Again</button></div>")
                            }
                        }
                    }
                }
            } else {
                if (errorFlag == false) {
                    document.getElementById('options').insertAdjacentHTML('beforeend',
                        "<h3>Sorry, no results were found. Perhaps you searched a start or end location that doesn't make sense. Or maybe it's the routing service/computer's fault!</h3>" +
                        "Whatever it is, we'll make sure it doesn't happen again." +
                        "<hr><div style='text-align: center'><button class=" +
                        "'btn btn-primary' type='submit' onclick = 'removeLine();deleteMarkers();resetMap();'>Search Again</button></div>")
                }
            }
        });
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
