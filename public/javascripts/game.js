var globalLat;
var globalLong;
var globalPos = {latitude: 0, longitude: 0};
 //initialize?
var globalPositionWatchNumber;
var mp3FilenameMap = new Map();
var snd = null;
var gameOver = false;
var finalPos; //initiliaze

function getLocation() {
	globalPositionWatchNumber = navigator.geolocation.watchPosition(setPosition, handleError, {enableHighAccuracy: true});
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

//Debug function putting it in an alert
function printPosition(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	console.log(latitude + ', ' + longitude);
	$('#alertSpace').html('<div class="alert alert-success" role="alert">Lat: ' + latitude + ', Long: ' + longitude + '</div>');
}

function setPosition(position) {
	globalPos.latitude = position.coords.latitude;
	globalPos.longitude = position.coords.longitude;
	
	globalLat = globalPos.latitude;
	globalLong = globalPos.longitude;
	
	console.log("globalLat: " + globalLat + ", globalLong: " + globalLong);
	checkSound();
	printPosition(position);
	
}

function fillPositionArray() {
	var pos = {
		latitude: 37.42512,
		longitude: -122.16074
	};
	mp3FilenameMap.set(pos, 'InsideOut');
	
	var pos2 = {
		latitude: 37.43510,
		longitude: -112.16070
	};	
	mp3FilenameMap.set(pos2, 'WakeBakeSkate');
	
}

function isPos2WithinMarginOfPos1(pos1, pos2, margin) {
	var lat1 = pos1.latitude;
	var lat2 = pos2.latitude;
	var long1 = pos1.longitude;
	var long2 = pos2.longitude;
	
	var maxLat = lat1 + margin;
	var minLat = lat1 - margin;
	var maxLong = long1 + margin;
	var minLong = long1 - margin;
	
	if (lat2 <= maxLat && lat2 >= minLat) {
		if (long2 <=maxLong && long2 >= minLong) {
			return true;
		}		
	}
	return false;	
}

function checkSound() {
	console.log("Checksound");
	
	for (var key of mp3FilenameMap.keys()) {
		console.log("the iterator");
		console.log(key.latitude);
		console.log(globalPos.latitude);
		console.log(key.longitude);
		console.log(globalPos.longitude);
		if (isPos2WithinMarginOfPos1(key, globalPos, 0.0001)) {
			play(mp3FilenameMap.get(key));
			mp3FilenameMap.delete(key);
		}
	}
	
	
	/*for (var key of mp3FilenameMap.keys()) {
		//Adding comment so I can commit.
		console.log("the iterator");
		console.log(key.latitude);
		console.log(globalPos.latitude);
		console.log(key.longitude);
		console.log(globalPos.longitude);
		if (isPos2WithinMarginOfPos1(key, globalPos, 0.0001)) {
			play(mp3FilenameMap.get(key));
			mp3FilenameMap.delete(key); //Right now works for only doing something once, deletes as soon as it's accessed
			//if (key === finalPos) endGame();
		}
	}*/
	
}
function play(sound) {
	if (window.HTMLAudioElement) {
		if (snd != null) snd.pause();
		snd = new Audio('');
 
    	/*if(snd.canPlayType('audio/ogg')) {
     	   snd = new Audio('sounds/' + sound + '.ogg');
   		 }
    		else */
		if(snd.canPlayType('audio/mp3')) {
      	  snd = new Audio(sound + '.mp3');
    	} 
   		snd.play();	
 	} else {
   		alert('HTML5 Audio is not supported by your browser!');
  	}
}


//$('#alertSpace').html('<div class="alert alert-success" role="alert">Ummmmm</div>');

document.querySelector('#alertSpace').innerHTML = "Javascript Linked!";

$('#playButton').click(function(){
	fillPositionArray();
	getLocation();
});


function endGame() {
	clearWatch(globalPositionWatchNumber);	
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


