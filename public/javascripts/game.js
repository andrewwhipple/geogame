var globalLat;
var globalLong;
var globalPos = {latitude: 0, longitude: 0};
 //initialize?
var globalPositionWatchNumber;
//var mp3FilenameMap = new Map();
var curSnd = null;
var gameOver = false;
var finalPos; //initiliaze


//Test using 2 arrays instead of a map
var positionArray = [];
var sndArray = [];

//Initiates watching the location. Basically just a wrapper of the geolocation api.
function getLocation() {
	globalPositionWatchNumber = navigator.geolocation.watchPosition(setPosition, handleError, {enableHighAccuracy: true});
	console.log("Meow");	
}


//Error handler for watchPosition. Inserts an alert onto the home page. 
function handleError(err) { 
	if (err.code == 1) { //user said no 
		$('#alertSpace').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"</span><span class="sr-only">Error:</span>This game does not work without location services.</div>');
} else if (err.code == 2) { //network down 
	$('#alertSpace').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Cannot connect to network, so I cannot get your location, and therefore cannot play the game.</div>');
} else if (err.code == 3) { //timeout 
	$('#alertSpace').html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>The network has timed out, so I cannot get your location, and therefore cannot play the game.</div>');
}
	
}

//Debug function putting the lat. and long. in an alert on the home page
function printPosition(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	console.log(latitude + ', ' + longitude);
	$('#alertSpace').html('<div class="alert alert-success" role="alert">Lat: ' + latitude + ', Long: ' + longitude + '</div>');
}

//Callback for watchPosition that sets the lat and long in the global "globalPos" object. Also currently calls printPosition to debug. Also calls checkSound() on each location update.
function setPosition(position) {
	globalPos.latitude = position.coords.latitude;
	globalPos.longitude = position.coords.longitude;
	
	console.log("globalLat: " + globalPos.latitude + ", globalLong: " + globalPos.longitude);
	checkSound();
	printPosition(position);
	
}

/*Sets up the position and snd database to initialize the game. 
	The database set up as a pair of arrays (rather than a map, because the Map object doesn't work on some mobile browsers...)

	There is one array of pos objects, and one array of Audio objects, and the appropriate a linked pos and snd object will have
	the same index in both arrays. 

	The nice thing about this over the map is there can be an explicit order to positions/sounds, so you can have a different 
	sound play the second etc time you visit a location.
*/
function buildDatabase() {
		
	var pos0 = {
		latitude: 37.42512,
		longitude: -122.16074
	};
	snd0 = new Audio('InsideOut.mp3');
	snd0.play();
	snd0.pause();
	
	addToDatabase(pos0, snd0, 0);
	

	var pos1 = {
		latitude: 37.425226,
		longitude: -122.160792
	};	
	snd1 = new Audio('WakeBakeSkate.mp3');
	snd1.play();
	snd1.pause();
	
	addToDatabase(pos1, snd1, 1);
	
}

//Comparison function that determines whether the 2nd pos object passed in is within "margin" degrees of pos1. 
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

//Loops through the database and compares the current position to the positions in the db, and if it finds one, plays that sound. 
//Also removes the sound from the db 
function checkSound() {
	console.log('Checksound');
	for (var i = 0; i < positionArray.length; i++) {
		console.log('forloop: '+ i);
		console.log(positionArray[i].latitude);
		console.log(globalPos.latitude);
		console.log(positionArray[i].longitude);
		console.log(globalPos.longitude);
		if (isPos2WithinMarginOfPos1(positionArray[i], globalPos, 0.00001)) {
			if (curSnd != null) curSnd.pause(); //only plays one sound at a time
			sndArray[i].play();
			curSnd = sndArray[i];
			removeFromDatabase(i);
		}
		
	}
	
	
	
	/*console.log("Checksound");
	mp3FilenameMap.forEach(function (value, key, mapObj) {
		console.log('iterator');
		console.log(key.latitude);
		console.log(globalPos.latitude);
		console.log(key.longitude);
		console.log(globalPos.longitude);
		if (isPos2WithinMarginOfPos1(key, globalPos, 0.0001)) {
			play(value);
			//mp3FilenameMap.delete(key);
		}
	});*/
	
	
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

//Removes the pos/snd pair at the given index from the database
function removeFromDatabase(index) {
	var removed = positionArray.splice(index, 1); //removes sound once it's played
	console.log(removed[0]);
	removed = sndArray.splice(index, 1);
	console.log(removed[0]);
	
}

function addToDatabase(pos, snd, index) {
	positionArray[index] = pos;
	sndArray[index] = snd;
}

//Currently unused, a play function. 
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



function pauseAll() {
	for (var i = 0; i < sndArray.length; i++) {
		sndArray[i].pause();
	}
	
}
//$('#alertSpace').html('<div class="alert alert-success" role="alert">Ummmmm</div>');

//document.querySelector('#alertSpace').innerHTML = "Javascript Linked!";


$('#playButton').click(function(){
	buildDatabase();
	getLocation();
});


function endGame() {
	clearWatch(globalPositionWatchNumber);	
	pauseAll();
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


