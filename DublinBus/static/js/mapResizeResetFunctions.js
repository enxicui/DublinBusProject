//resizes map for directions on the right side
function resizeMap(passedStart, passedEnd) {
    try {
       var start = document.getElementById('origin-input').value;
       var end = document.getElementById('destination-input').value;
    }
    catch (TypeError) {
        start = passedStart;
        end = passedEnd;
    }
    var date = document.getElementById('dateField').value;
    var time = document.getElementById('timepicker1').value;
    deleteMarkers();
    if (time == "" || date == "") {
        var flag = 0;
        document.getElementById("options").innerHTML = "<h4 style = 'text-align: center'>Please enter a date and time!</h4>" +
            "<div style = 'text-align: center'>" +
            "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'buildDateTime("+flag+",\""+start+"\",\""+end+"\")'>Try Again</button> " +
            "</div>";
    } else if (start == "" || end == "") {
        document.getElementById("options").innerHTML = "<h4 style = 'text-align: center'>Please enter a start and end location!</h4>" +
            "<div style = 'text-align: center'>" +
            "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'resetMap()'>Try Again</button> " +
            "</div>";
    } else {
        document.getElementById('options').style.width = "500px";
        getLatLng(start, end, time, date);
    }
}

/**
 * resizes mobile page for directions to be shown.
 * Error handling in case fields aren't filled
 */
function mobileResizeMap() {
    deleteMarkers();
    var start = document.getElementById('origin-input').value;
    var end = document.getElementById('destination-input').value;
    var date = document.getElementById('dateField').value;
    var time = document.getElementById('timepicker1').value;
    if (start == "" || end == "" || time == "" || date == "") {
        document.getElementById("header").innerHTML = "<h4 style = 'text-align: center'>Please ensure all fields are filled out!</h4>" +
            "<div style = 'text-align: center'>" +
            "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'createHeader(); setAutocomplete()'>Try Again</button> " +
            "</div>";
    } else {
        document.getElementById('header').innerHTML =
            "<div style = 'text-align: center'>" +
            "            <input autocomplete=\"off\" class=\"controls\" id=\"origin-input\"" +
            "                   placeholder=\"Enter an origin location\" type=\"text\">" +
            "        </div>" +
            "        <div style = 'text-align: center'>" +
            "            <input autocomplete=\"off\" class=\"controls\" id=\"destination-input\"" +
            "                   placeholder=\"Enter a destination location\" type=\"text\" >" +
            "        </div>" +
            "<div style = 'text-align: center'>" +
            "            <input style = 'width:150px' class=\"controls\" id='dateField' name='daterange' type='text''/>" +
            "            <input style = 'width:150px' class=\"controls\" autocomplete=\"off\" id=\"timepicker1\" placeholder=\"Please select a time\" type=\"text\">" +
            "    </div>" +
            "    <br>";
        document.getElementById('origin-input').value = start;
        document.getElementById('destination-input').value = end;
        document.getElementById('routes').style.display = 'block';
        mobileGetLatLng(start, end, time, date);
    }
    $(document).ready(function () {
        calendarBuilder();
        $(function () {
            $('#timepicker1').timepicker({
                timeFormat: 'H:i',
                dynamic: false,
                dropdown: true,
                scrollbar: true,
                step: 30,
            })
        })
    });
    var currentDate = new Date();
    var endDate = new Date();
    var numberOfDaysToAdd = 4;
    currentDate.setDate(currentDate.getDate() + 1);
    endDate.setDate(currentDate.getDate() + numberOfDaysToAdd);

    function calendarBuilder() {
        $('input[name="daterange"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minDate: currentDate,
            maxDate: endDate
        })
    }
}

/**
 * Resets the mobile page completely
 */
function mobileResetMap() {
    document.getElementById('routes').style.display = 'none';
    document.getElementById('map').style.display = 'block';
    createHeader();
    setAutocomplete();
    if (document.getElementById('againButt')) {
        document.getElementById('againButt').remove();
    }
}

/**
 * sets the map back to original position, resets the side bar to the 'search dublin' option
 *
 */
function resetMap() {
    document.getElementById('directions').style.display = "none";
    document.getElementById('coTwo').innerHTML = "";
    document.getElementById('options').style.width = '300px';
    document.getElementById('options').style.height = "300px";
    document.getElementById('options').innerHTML =
        " <div id='journeyPlan' style='display:none'>\n" +
        "            <h5 style=\"text-align: center; padding-top: 15%\">Start your journey here!</h5>\n" +
        "            <br>\n" +
        "            <h6 style=\"text-align: center\">Enter a start and end location!</h6>\n" +
        "\n" +
        "            <div style=\"text-align: center\">\n" +
        "\n" +
        "                <input autocomplete=\"off\" class=\"controls\" id=\"origin-input\" placeholder=\"Enter an origin location\"\n" +
        "                       style=\"text-align: center\"\n" +
        "                       type=\"text\">\n" +
        "\n" +
        "                <input autocomplete=\"off\" class=\"controls\" id=\"destination-input\"\n" +
        "                       placeholder=\"Enter a destination location\"\n" +
        "                       style=\"text-align: center\"\n" +
        "                       type=\"text\">\n" +
        "\n" +
        "            </div>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' id=\"directionsButton\" onclick=\"buildDateTime()\" style='width: 200px;'\n" +
        "                        type=\"submit\">Next\n" +
        "                </button>\n" +
        "            </div>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' id=\"locationButton\" onclick=\"findLocation()\" style='width: 200px;'\n" +
        "                        type=\"submit\">Find Stations Near Me!\n" +
        "                </button>\n" +
        "            </div>\n" +
        "            <br>\n" +
        "\n" +
        "            <br>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' onclick=\"hideOptions()\" style='width: 200px;' type=\"submit\">Hide Options\n" +
        "                    ^\n" +
        "                </button>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div id='timeDate' style='display:none'>\n" +
        "            <h5 style=\"text-align: center; padding-top: 15%\">Enter a time and date!</h5>\n"+
        "            <div style='text-align: center'>\n" +
        "                <input class='controls' id='dateField' name='daterange' style='width:250px' type='text'>\n" +
        "                <input autocomplete='off' class='controls' id='timepicker1' placeholder='Please select a time'\n" +
        "                       style='width:250px' type='text'>" +
        "                <br>"+
        "                <br>"+
        "                <button class='btn btn-primary' id=\"directionsButton2\" onclick=\"resizeMap()\" type=\"submit\">Search\n" +
        "                </button>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div id='searchOnly' style='display:block'>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <h5 style=\"padding-top: 15%;\">Search for a place in Dublin to visit!</h5>\n" +
        "                <input autocomplete=\"off\" class=\"controls\" id=\"pac-input\" placeholder=\"Search Dublin\"\n" +
        "                       style='width: 200px;' type=\"text\">\n" +
        "            </div>\n" +
        "            <br>\n" +
        "            <div style=\"text-align: center\">\n" +
        "                <button class='btn btn-primary' id=\"optionsButton\" onclick=\"showOptions()\"\n" +
        "                        style='width: 200px;' type=\"submit\">Show Journey Planner\n" +
        "                </button>\n" +
        "            </div>\n" +
        "        </div>";
    var currentDate = new Date();
    var endDate = new Date();
    var numberOfDaysToAdd = 4;
    currentDate.setDate(currentDate.getDate() + 1);
    endDate.setDate(currentDate.getDate() + numberOfDaysToAdd);
    calendarBuilder();
    $(function () {
        $('#timepicker1').timepicker({
            timeFormat: 'H:i',
            dynamic: false,
            dropdown: true,
            scrollbar: true,
            step: 30,
        })
    });
    function calendarBuilder() {
        $('input[name="daterange"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minDate: currentDate,
            maxDate: endDate
        })
    }
    autocompSearchBar();
    setAutocomplete();

}

/**
 * Return to possible routes and hide map
 */
function mobileMapReturnHide() {
    document.getElementById('map').style.display = "none";
    document.getElementById('return').innerHTML = "";

}

/**
 * If you click 'show journey planner' on main page for desktop
 */
function showOptions() {
    document.getElementById('searchOnly').style = 'display:none';
    document.getElementById('options').style.height = "auto";
    document.getElementById('journeyPlan').style = 'display:block';
}
/**
 * If you click 'hide options' on main page for desktop
 */
function hideOptions() {
    document.getElementById('journeyPlan').style = 'display:none';
    document.getElementById('options').style.height = "300px";
    document.getElementById('searchOnly').style = 'display:block';
}
