/**
 * Rebuilds the date and time portion of the Options menu for journey planner.
 *
 * @param flag indicates to the function whether a start and end has been passed properly, otherwise asks to try again.
 * @param myStart starting location value
 * @param myEnd ending location value
 */
function buildDateTime(flag = 1, myStart = '', myEnd = '') {
    if (flag == 1) {
        document.getElementById('options').style.height = '300px';
        var start = document.getElementById('origin-input').value;
        var end = document.getElementById('destination-input').value;
        if (start == "" || end == "") {
            document.getElementById("options").innerHTML = "<h4 style = 'text-align: center'>Please enter a start and end location!</h4>" +
                "<div style = 'text-align: center'>" +
                "<br> <br> <button class='btn btn-primary' id = 'directionsButton'  type='submit' onclick = 'resetMap()'>Try Again</button> " +
                "</div>";
        } else {
            document.getElementById('journeyPlan').style.display = 'none';
            document.getElementById('timeDate').style.display = 'block';
        }
    }
    else {
        document.getElementById('options').style.height = '300px';
        start = myStart;
        end = myEnd;
        document.getElementById("options").innerHTML =
            "<div id='timeDate'>" +
            "            <h5 style=\"text-align: center; padding-top: 15%\">Enter a time and date!</h5>" +
            "            <div style='text-align: center'>" +
            "                <input class='controls' id='dateField' name='daterange' style='width:250px' type='text'>" +
            "                <input autocomplete='off' class='controls' id='timepicker1' placeholder='Please select a time'" +
            "                       style='width:250px' type='text'>" +
            "                <br>" +
            "                <br>" +
            "                <button class='btn btn-primary' id=\"directionsButton2\" onclick=\"resizeMap('"+start+"','"+end+"')\" type=\"submit\">Search" +
            "                </button>" +
            "            </div>" +
            "        </div>";
        calendarTimeSet();
    }

}

/**
 * Creates the header for the mobile page options, which means that it will create a destination, origin, time and date.
 */
function createHeader() {
    document.getElementById('header').innerHTML =
        '<div id = "header" class = "col-12">' +
        '    <h3 style="text-align: center">Start your journey here</h3>' +
        '    <br>' +
        '    <h4 style="text-align: center">Enter a start and end location</h4>' +
        '    <div style = \'text-align: center\'>' +
        '        <input autocomplete="off" class="controls" id="origin-input"' +
        '               placeholder="Enter an origin location" type="text">' +
        '    </div>' +
        '    <div style = \'text-align: center\'>' +
        '        <input autocomplete="off" class="controls" id="destination-input"' +
        '               placeholder="Enter a destination location" type="text">' +
        '    </div' +
        "<div style = 'text-align: center'>" +
        "            <input style = 'width:150px' class=\"controls\" id='dateField' name='daterange' type='text''/>" +
        "            <input style = 'width:150px' class=\"controls\" autocomplete=\"off\" id=\"timepicker1\" placeholder=\"Please select a time\" type=\"text\">" +
        "    </div>" +
        "    <br>" +
        '    <div style="text-align: center">' +
        '        <button class=\'btn btn-primary\' id="directionsButton" onclick="mobileResizeMap()" type="submit">Search' +
        '        </button>' +
        '    </div>' +
        '</div>';
    calendarTimeSet();
}

/**
 * Gets the date and time inputs properly working by assigning their values.
 */
function calendarTimeSet() {
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
