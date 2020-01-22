/**
 * Adds a favourite to the user's account
 *
 * @param user who will have the favourite added
 * @returns {Promise<void>}
 */
async function updateUserFav(user) {
    var origin = document.getElementById("origin-input").value;
    var destination = document.getElementById("destination-input").value;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/users/addFav/');
    xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhttp.send("start=" + origin + "&end="+destination+"&user="+user);
    var returnData = this.responseText;
    if (returnData == 400) {
        alert("There was an error on the server side of things. Try again!")
    }
    await sleep(200);
    location.reload();

}

/**
 * Removes a favourites from the database.
 * @param startLoc Starting location
 * @param endLoc Ending location
 * @param user that will have the favourite removed
 * @returns {Promise<void>}
 */
async function removeFav(startLoc,endLoc,user) {
    startLoc = startLoc.replace(/4343/g, "'");
    endLoc = endLoc.replace(/4343/g, "'");
    var myReq = new XMLHttpRequest();
    myReq.open("POST", 'delete_fav/');
    myReq.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    myReq.send("start=" + startLoc + "&end="+endLoc+"&user="+user);
    var returnData = this.responseText;
    if (returnData == 400) {
        alert("There was an error on the server side of things. Try again!")
    }
    await sleep(100);
    location.reload();

}

function getFavRoute(start, end ) {
    window.location.href = '/journeyplan?start='+start+'&end='+end;

   // xhttp = new XMLHttpRequest();
   // xhttp.open("POST", '/journeyplan/getFavRoute/', true);
   // xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
   // xhttp.setRequestHeader('x-csrf-token', csrftoken);
   // xhttp.send("start="+start+"&end="+end);
}