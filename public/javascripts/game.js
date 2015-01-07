var globalLat;
var globalLong; //initialize?
var globalPositionWatchNumber;
var mp3FilenameArray = []; //initialize with filenames

function getLocation() {
	globalPositionWatchNumber = navigator.geolocation.watchPosition(printPosition, handleError, {enableHighAccuracy: true});
	console.log("Meow");	
}

function handleError(err) { 
	if (err.code == 1) { //user said no 
		$('#alertSpace').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"</span><span class="sr-only">Error:</span>This game does not work without location services.</div>');
} else if (err.code == 2) { //network down 
	$('#alertSpace').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Cannot connect to network, so I cannot get your location, and therefore cannot play the game.</div>');
} else if (err.code == 3) { //timeout 
	$('#alertSpace').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>The network has timed out, so I cannot get your location, and therefore cannot play the game.</div>');
}
	
}
function printPosition(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	console.log(latitude + ', ' + longitude);
	$('#alertSpace').html('<div class="alert alert-success" role="alert">Lat: ' + latitude + ', Long: ' + longitude + '</div>');
}

function setLocation(position) {
	globalLat = position.coords.latitude;
	globalLong = position.coords.longitude;
	console.log("globalLat: " + latitude + ", globalLong: " + longitude)
	
}

/*General design:

selectGame()

if (Modernizr.geolocation) {
	play the game

} else {
	Sorry, you can't play this game in this browser.

}

gameLoop {
	
	if (gameNotOver) {
		playSound()
	} else {
		clearWatch(globalPositionWatchNumber);
	}
	
	
}

function wait() {
	wait however many seconds;
}

function playSound() {
	if old sounds can be interupted by new ones {
		
	} else {
		if (soundOver) {
			var index = comparePositionToDatabase();
			playSoundAtIndex(index);
		}
	}
	

}

function comparePositionToDatabase() {
	take lat and long, within a window, and look it up in the game database;

}

function playSoundAtIndex(index) {
	look up in game database and pull out mp3 at index;
	play that mp3;
	
}




*/


getLocation();