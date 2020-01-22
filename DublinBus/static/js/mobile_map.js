// Initialize and add the map
function initMap() {
    var pos;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    // The location of Dublin
    var dublin = {lat: 53.33306, lng: -6.24889};
    // The map, centered at Uluru
    var im = {
        url: '../static/img/userLoc.png', // url
        scaledSize: new google.maps.Size(64, 64), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
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
    addMarker(map, stopData);
    autocompSearchBar();
    setAutocomplete();

};

/**
 * Used to get the real time information and handle it for the marker info windows
 *
 * @param url for the API
 * @param callback function called if status is 'OK'
 */
var getJSON = function (url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function () {

        var status = xhr.status;

        if (status == 200) {

            callback(null, xhr.response);


        } else {

            callback(status);
        }
    };

    xhr.send();
};


function addMarker(map, data) {
    //get the stop data from JSON file
    var infowindow = new google.maps.InfoWindow({});
    //*
    //*
    for (var i = 0, length = data.length; i < length; i++) {
        // var routedata = routedata[i]
        var busdata = data[i];
        // {#Console.log(busdata);#}
        var myLatLng = {lat: parseFloat(busdata.latitude), lng: parseFloat(busdata.longitude)};


        // console.log(route_data[busdata.actual_stop_id]);
        let serviceRoute = add_service_route(route_data[busdata.actual_stop_id]);
        var icon = {
            url: '../static/img/iconsmarker1.png', // url
            scaledSize: new google.maps.Size(40, 40), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        // Creating  markers and putting it on the map
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: icon,
            title: busdata.actual_stop_id + "\n" + busdata.stop_name,
            // content is the stop info
            content: '<div id="content' + busdata.actual_stop_id + '" >' +
                '<div id=stop' + busdata.actual_stop_id + '>' +
                "<div><img src='../static/img/bus-blue-icon.png' alt='bus-blue-icon' width='12%' height='12%'>" +
                '<h6 style="margin-left: 15%; font-family:Tangerine; font-size:15px;">Stop ID: ' + busdata.actual_stop_id + '</h6></div>' +
                '<h style="margin-left: 15%; font-family:Tangerine; font-size:15px;"><b>Stop name:</b><br>' + '<p style="margin-left: 8%">' + busdata.stop_name + '</p></h>' +

                '<h style="margin-left: 15%; font-family:Tangerine;  font-size:12px;"><b>Serving route:</b><br>' + '<ul id="myList">' + serviceRoute + '</ul>' + '</p></div>' +

                '<button class = "btn btn-primary" id="realtime" onclick="get_real_time_data(' + busdata.actual_stop_id + ')">' +
                '<p id="realtime_p" style="font-family:Tangerine; font-size:12px;">Real Time Info</p>' +
                '</button>' +
                '</div>'


        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent('<div class="infowin">' + this.content + '</div>');
            infowindow.open(map, this);

        });
        marker.setMap(map);
        markers.push(marker);
    }


}
// this function calls realtime api to get the real time info

function get_real_time_data(id) {
    if (document.getElementById('realtime' + id) == null) {
        getJSON('https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=' + id + '&format=json', function (err, datainfo) {

            // realtime table head
            var texthead = `<h6 style = "padding-left : 1%; font-size:15px; padding-top: 2%">Stop: ${datainfo.stopid}</h6>
                            <p style = "padding-left : 1%;font-family:Tangerine; font-size:15px;">Data Refreshed at: ${datainfo.timestamp}</p>`
            var text = `<table  style=" width:100%;  margin: auto; text-align: center; border: 1px solid black;border-collapse: collapse">
                            <tr> 
                            <th style=" border: 1px solid #ddd; width: 20%;font-family:Tangerine; color: white;font-size:12px; background-color: #1C6EA4"; >Bus</th>
                            <th style=" border: 1px solid #ddd; width: 50%;font-family:Tangerine; color: white;font-size:12px; background-color: #1C6EA4">Destination</th>
                            <th style=" border: 1px solid #ddd; width: 30%;font-family:Tangerine; color: white;font-size:12px; background-color: #1C6EA4">Due</th>
                            </tr></table>
                            `
            var content = "";
            for (var i = 0, length = datainfo.results.length; i < length; i++) {
                if (datainfo.results[i].duetime == 1) {
                    var minute = "min";
                } else if (datainfo.results[i].duetime == 'Due'){
                    minute = "";
                } else{
                    minute = "mins";
                }

                // show realtime content
                content += `<table style=" width: 100%; margin: auto; text-align: center; border: 1px solid black; border-collapse: collapse">
                    <tr><td style=" border: 1px solid #ddd; width: 20%;font-family:Tangerine; font-size:12px;">${datainfo.results[i].route}</td>
                    <td style=" border: 1px solid #ddd; width: 50%;font-family:Tangerine; font-size:12px;">${datainfo.results[i].destination}</td>
                    <td style=" border: 1px solid #ddd; width: 30%;font-family:Tangerine; font-size:12px;">${datainfo.results[i].duetime}${minute}</td>
                    </tr></table>`
            }
            document.getElementById("stop" + id).style.display = 'none';
            $('#content' + id).append('<div id="realtime' + id + '">' + texthead + text + content + "</div>");
            document.getElementById("realtime_p").innerHTML = "<img src='../static/img/back-icon.png' alt='back-icon' style='width: 10px; height: 10px'>";
        });


    } else if (document.getElementById("stop" + id).style.display === 'none') {
        document.getElementById("stop" + id).style.display = 'block';
        document.getElementById("realtime" + id).style.display = 'none';
        document.getElementById("realtime_p").innerText = "Real Time Info";
    } else {
        document.getElementById("stop" + id).style.display = 'none';
        document.getElementById("realtime" + id).style.display = 'block';
        document.getElementById("realtime_p").innerHTML = "<img src='../static/img/back-icon.png' alt='back-icon' style='width: 10px; height: 10px'>";
    }
}


function add_service_route(route_data) {
    if (route_data == null || route_data.length == 0) {
        return "";
    }

    let elem = "";
    for (let i = 0; i < route_data.length; i++) {
        elem += '<li>' + route_data[i][0] + '-' + route_data[i][1] + '</li>';
    }
    return elem;
}

function closestLocation(targetLocation, locationData) {
    function vectorDistance(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
        var dx = location1.latitude - location2.latitude,
            dy = location1.longitude - location2.longitude;

        return vectorDistance(dx, dy);
    }

    return locationData.reduce(function (prev, curr) {
        var prevDistance = locationDistance(targetLocation, prev),
            currDistance = locationDistance(targetLocation, curr);
        return (prevDistance < currDistance) ? prev : curr;
    });
}