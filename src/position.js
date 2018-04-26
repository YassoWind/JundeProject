function GetLocation() {
    console.log("Geolocation....");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

        //   navigator.geolocation.watchPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
        "<br />Longitude: " + position.coords.longitude);
}