
function routeButton(hold, i, url, start, end){
    var hold = hold;
    var i = i;
    var url = url;
    var start = start;
    var end = end;
    document.getElementById('options').insertAdjacentHTML('beforeend',
    '<button id =' + i + ' class="btn btn-primary" type="submit" ' +
    'onclick = "getRoute(' + i + ', \'' + url + '\', \'' + start + '\',\'' + end + '\')"></button>');
    document.getElementById(i).innerHTML = hold;
}

