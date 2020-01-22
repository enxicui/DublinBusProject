
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
    var infowindow = new google.maps.InfoWindow();
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
                content:  '<div><button class = "btn btn-primary" onclick = "routeToHere(\'' + location + '\')">' +
                    '<p style="font-family:Tangerine; font-size:12px;">Route Me to This Location</p>' +
                    '</button></div>'
            });
            // Create a marker for each place.
            markers.push(myMark);

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
