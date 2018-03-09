// Global Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin. Mask allows the user to type in numbers in the form and it will automatically add the ":""
var elTrainTime = $("#train-time").mask("00:00");
var elTimeFreq = $("#time-freq").mask("00");



// Initialize Firebase
var config = {
	apiKey: "AIzaSyC2USKEqztDObJApWJoG3dI7UZ-mV_DtfA",
	authDomain: "train-time-79141.firebaseapp.com",
	databaseURL: "https://train-time-79141.firebaseio.com",
	projectId: "train-time-79141",
	storageBucket: "train-time-79141.appspot.com",
	messagingSenderId: "737074193736"
};
firebase.initializeApp(config);


// Assign the reference to the database to a variable named 'database'
var database = firebase.database();


database.ref("/trains").on("child_added", function (snapshot) {

	//  create local variables to store the data from firebase
	var trainDiff = 0;
	var trainRemainder = 0;
	var minutesTillArrival = "";
	var nextTrainTime = "";
	var frequency = snapshot.val().frequency;

	// compute the difference in time from 'now' and the first train. 
	// unix creates a moment variable out of the time of the "snapshot" value. snapshot.val().time returns to me the time that it was when the user added the time to the train. and compares that to the time when it leaves.
	trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

	// get the remainder of time by using 'moderator' with the frequency & time difference, store in var
	trainRemainder = trainDiff % frequency;

	// subtract the remainder from the frequency, store in var
	minutesTillArrival = frequency - trainRemainder;

	// add minutesTillArrival to now, to find next train & convert to standard time format. 
 
	nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

	// append to our table of trains, inside tbody, with a new row of the train data
	$("#table-data").append(
		"<tr><td>" + snapshot.val().name + "</td>" +
		"<td>" + snapshot.val().destination + "</td>" +
		"<td>" + frequency + "</td>" +
		"<td>" + minutesTillArrival + "</td>" +
		"<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
	);

	$("span").hide();

	// Hover view of delete button
	$("tr").hover(
		function () {
			$(this).find("span").show();
		},
		function () {
			$(this).find("span").hide();
		}
	);

	// STARTED BONUS TO REMOVE ITEMS ** not finished **
	$("#table-data").on("click", "tr span", function () {
		console.log(this);
		var trainRef = database.ref("/trains/");
		console.log(trainRef);
	});
});

// function to call the button event, and store the values in the input form
var storeInputs = function (event) {
	// prevent from from reseting
	event.preventDefault();

	// get & store input values
	trainName = elTrain.val().trim();
	trainDestination = elTrainDestination.val().trim();
	trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
	trainFrequency = elTimeFreq.val().trim();

	// add to firebase databse
	database.ref("/trains").push({
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency,
		nextArrival: nextArrival,
		minutesAway: minutesAway,
		date_added: firebase.database.ServerValue.TIMESTAMP
	});

	//  alert that train was added
	alert("Train successuflly added!");

	//  empty form once submitted
	elTrain.val("");
	elTrainDestination.val("");
	elTrainTime.val("");
	elTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function (event) {
	// form validation - if empty - alert
	if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
		alert("Please Fill All Required Fields");
	} else {
		// if form is filled out, run function
		storeInputs(event);
	}
});

$("#btn-reset").on("click", function () {
	$("#table-data").empty();
	database.ref("/trains").remove();
})

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function (event) {
	if (event.which === 13) {
		// form validation - if empty - alert
		if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
			alert("Please Fill All Required Fields");
		} else {
			// if form is filled out, run function
			storeInputs(event);
		}
	}
});