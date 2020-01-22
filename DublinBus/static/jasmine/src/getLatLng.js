/**
 * The getLatLng() function is the first one called in the setting up of the directions window. The function gets the start
 * and end points off of the input boxes, and then calls the Google Geocode Service to get latitude and longitudes for each
 * spot. From there, it calls the HERE Transit API, which will provide a list of routes and directions between the
 * two latitude and longitude points. The function then tells the user which bus lines are possible between two points
 * and also indicates how many connections each route has.
 */


function getLatLng(start, end) {
    returnvalue=[]
    functionfive = 0;
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    var url = "";
    geocoder.geocode({
        'address': start
    }, function(results, status) {
        if (status == 'OK') {
            var loc = results[0].geometry.location;
            startLat = loc.lat();
            startLong = loc.lng();
        }
        geocoder2.geocode({
            'address': end
        }, function(results, status) {
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
            }
            
            let promise = new Promise((resolve, reject) => {
            sendRequest(returnvalue[0],returnvalue[1],returnvalue[2],returnvalue[3],returnvalue[4]);
            });
            let returnvar = promise.then(JSON.parse);

            // returnvalue.push(startLat,startLong,destLat,destLong,date);
            console.log("return var", returnvar);

        })
    })
    funcreturn = sendRequest(returnvalue[0],returnvalue[1],returnvalue[2],returnvalue[3],returnvalue[4]);
    // console.log("hello",returnvalue[0],returnvalue[1],returnvalue[2],returnvalue[3],returnvalue[4])
    return funcreturn
}