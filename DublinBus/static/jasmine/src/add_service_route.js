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