/**
 * Initialize map and get user location
 */
function initMap() {
    var dublin = {lat: 53.33306, lng: -6.24889};
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 16, center: dublin});
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: dublin, map: map});
    var infowindow = new google.maps.InfoWindow({});
    var im = {
        url: '../static/img/userLoc.png', // url
        scaledSize: new google.maps.Size(64, 64), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var userMarker = new google.maps.Marker({
                position: pos,
                map: map,
                gestureHandling: 'greedy',
                animation: google.maps.Animation.DROP,
                icon: im
            });
            map.setCenter(pos);
            google.maps.event.addListener(userMarker, 'click', function () {
                infowindow.setContent('This is where you are!');
                infowindow.open(map, userMarker);
            });
        });
    }
    addTourismMarkers(map, tourism);
    addMarker(map, data);

};


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

/**
 * Add the 20 tourism markers to the map for gamification innovation
 * @param map The map to which the markers will be added
 * @param data the array containing all the markers
 */
function addTourismMarkers(map, data) {
    //get the stop data from JSON file
    var infowindow = new google.maps.InfoWindow({});
    //*
    //*
    for (var i = 0, length = data.length; i < length; i++) {
        // var routedata = routedata[i]
        var busdata = data[i];
        // {#Console.log(busdata);#}
        var myLatLng = {lat: parseFloat(busdata.lat), lng: parseFloat(busdata.lon)};


        // console.log(route_data[busdata.actual_stop_id]);
        var icon = {
            url: '../static/img/tourismMarker.png', // url
            scaledSize: new google.maps.Size(60, 60), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        // Creating  markers and putting it on the map
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: icon,
            title: busdata.actual_stop_id + "\n" + busdata.name,
            // content is the stop info
            content: 'Visit here to earn some tourism points! This is ' + '<b>' + busdata.name + '</b>'+ ', a well known tourist spot' +
                ' here in Dublin. To learn more about it, visit <a href="https://www.wikipedia.com/wiki/'+busdata.name+'" style="color: palevioletred; font-weight: bolder;">this link!</a>'

        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent('<div class="infowin">' + this.content + '</div>');
            infowindow.open(map, this);

        });
        marker.setMap(map);
    }
}


/**
 * Add the markers to the map for all bus stops
 * @param map The map to which the markers will be added
 * @param data the array containing all the markers
 */
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

                '<button id="realtime" onclick="get_real_time_data(' + busdata.actual_stop_id + ')">' +
                '<p id="realtime_p" style="font-family:Tangerine; font-size:12px;">Real Time Info</p>' +
                '</button>' +
                '</div>'


        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent('<div class="infowin">' + this.content + '</div>');
            infowindow.open(map, this);

        });
        marker.setMap(map);
    }

}


/**
 * this function calls realtime api to get the real time info
 * @param id Is the ID of the stop for which we will get data.
 */
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

/**
 * Adds information about which routes serve this stop
 * @param route_data All information about routes
 * @returns {string|string|string}  Stop information
 */
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
