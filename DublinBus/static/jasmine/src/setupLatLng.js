function setupLatLng(start, end) {
    document.getElementById('options').style.height = "26vh";
    document.getElementById('options').innerHTML = "<h3>Possible Routes</h3>";

    start = start.replace("'", "\\'");
    //set the HTML for the routes list
    //start and end points
    var dublin = {
        lat: 53.33306,
        lng: -6.24889
    };
    map.panTo(dublin);
    getLatLng(start, end)
}