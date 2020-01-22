
function printConnections(connections){
    var connections = connections;
    if (connections == 1) {
        document.getElementById('options').insertAdjacentHTML('beforeend', " (No connections) </p>");
    } else if (connections > 1) {
        document.getElementById('options').insertAdjacentHTML('beforeend', " (" + connections +
            " connections) </p>");
}
}