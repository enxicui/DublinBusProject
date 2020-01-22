

function printResults(parseMe, url, start, end) {
    var parseMe = parseMe;
    var url = url;
    var start = start;
    var end = end;
    console.log("parse", parseMe)
    for (var i = 0; i < parseMe.length; i++) {
        console.log("next")
        var parsed = parseMe[i]["Sections"]["Sec"];
        var connections = 0;
        for (var x = 0; x < parsed.length; x++) {
            //mode == 5 means that it's a bus traveled method
            if (parsed[x]['mode'] == 5) {
                connections++;
                if (connections == 1) {
        console.log('got here 2');

                    //give the list of routes
                    var hold = parsed[x]['Dep']['Transport']['name'] + ' toward ' + parsed[x]['Dep']['Transport']['dir'];
                    // routeButton(hold,i, url, start, end);
                    console.log("connections", connections)

                }
            }

        }
        //calculate time
        //let the user know how many connections required per route.
        printConnections(connections);

    }
    //option to reset the searches
    // document.getElementById('options').insertAdjacentHTML('beforeend', "<button class='gbtn btn-primary' type='submit' onclick = 'removeLine();deleteMarkers();resetMap();'>Search Again</button>");
    return(connections)
}


