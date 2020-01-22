
// this function calls realtime api to get the real time info
function get_real_time_data2(id) {
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
                } else if (datainfo.results[i].duetime == 'Due') {
                    minute = "";
                } else {
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