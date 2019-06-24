var DIGIT_BITMAP = [
	[1, 1, 1, 0, 1, 1, 1],     // 0
	[0, 0, 1, 0, 0, 1, 0],
	[1, 0, 1, 1, 1, 0, 1],     // 2
	[1, 0, 1, 1, 0, 1, 1],
	[0, 1, 1, 1, 0, 1, 0],     // 4
	[1, 1, 0, 1, 0, 1, 1],
	[1, 1, 0, 1, 1, 1, 1],     // 6
	[1, 0, 1, 0, 0, 1, 0],
	[1, 1, 1, 1, 1, 1, 1],     // 8
	[1, 1, 1, 1, 0, 1, 1]
];

function $q(selector, context) {
	return (context || document).querySelector(selector);
}

function setDigit(context, which, value) {
	var $digit = $q(".digit" + which, context);
	for (var bar = 0; bar <= 6; bar++) {
		var $bar = $q(".bar" + bar, $digit);
		if (DIGIT_BITMAP[value][bar] === 0) {
			addClass($bar, "off");
		} else {
			removeClass($bar, "off");
		}
	}
}

function addClass(element, klass) {
	if (!hasClass(element, klass)) {
		element.className = (element.className || '') + " " + klass;
	}
}

function removeClass(element, klass) {
	if (hasClass(element, klass)) {
		// Pad out w/ delimiters to isolate classname.
		element.className = (" " + (element.className || '') + " ").
				replace(" " + klass + " ", "").
				replace(/^\s+/, '').
				replace(/\s+$/, '');
	}
}

function hasClass(element, klass) {
	var classes = (element.className || '').split(/\s/);

	for (var i = 0; i < classes.length; i++) {
		if (classes[i] === klass) {
			return true;
		}
	}

	return false;
}

function update(context) {
	var d = new Date(),
		hh = d.getHours(),
		mm = d.getMinutes(),
		ss = d.getSeconds(),
		hours = [],
		minutes =[];
			
	if (hh > 12) {
		hh -= 12;
		addClass($q(".am", context), "off");
		removeClass($q(".pm", context), "off");
	} else {
		removeClass($q(".am", context), "off");
		addClass($q(".pm", context), "off");
	}
	
	setDigit(context, 1, Math.floor(hh/10));
	setDigit(context, 2, hh % 10);
	setDigit(context, 3, Math.floor(mm/10));
	setDigit(context, 4, mm % 10);
	setDigit(context, 5, Math.floor(ss/10));
	setDigit(context, 6, ss % 10);

	$q(".separator", context).className = (ss % 2) === 0 ? 'separator' : 'separator off';

	// $q(".date", context).innerHTML = d.toString().replace(/2013.*$/, '').replace(/ 0/, ' ');
}

//get alarm and format
function getAlarm() {
	var alarmNotFromated = sessionStorage.getItem("lastAlarm");
	
	if(alarmNotFromated != null && alarmNotFromated != "null") {
		alarmNotFromated = new Date(alarmNotFromated);
		
		var day = Number(alarmNotFromated.getDate());
		if(alarmNotFromated.getDate() < 10)
			day =  0 + String(day);
	
		var month =  Number(alarmNotFromated.getMonth()) + 1;  //month between 0 - 11
		if(month < 10)
			month = "0" + String(month);
	
		var hour =  Number(alarmNotFromated.getHours());
		if(hour < 10)
			hour = "0" + String(hour);

		var minute =  Number(alarmNotFromated.getMinutes());
		if(minute < 10)
			minute = "0" + String(minute);

		alarmFromated = day + "/" + month + "/" + alarmNotFromated.getFullYear() + " " + hour + ":" + minute;
	}
	else
		alarmFromated = null;
	
	return alarmFromated;
}


// return alarm in format YYYY*MM-DDTHH:MI
function getAlarmUTC() {
	var alarmNotFromated = sessionStorage.getItem("lastAlarm");
	
	if(alarmNotFromated != null && alarmNotFromated != "null") {
		alarmNotFromated = new Date(alarmNotFromated);
		
		var day = Number(alarmNotFromated.getDate());
		if(alarmNotFromated.getDate() < 10)
			day =  0 + String(day);
	
		var month =  Number(alarmNotFromated.getMonth()) + 1;
		if(month < 10)
			month = "0" + String(month);
	
		var hour =  Number(alarmNotFromated.getHours());
		if(hour < 10)
			hour = "0" + String(hour);

		var minute =  Number(alarmNotFromated.getMinutes());
		if(minute < 10)
			minute = "0" + String(minute);

		alarmFromated = alarmNotFromated.getFullYear() + "-" + month + "-" + day + "T" + hour + ":" + minute;
	}
	else
		alarmFromated = null;
	
	return alarmFromated;
}


// Manage the text to display (Set or Reset Alarm)
function updateTextAlarm() {
	var alarmText = $q("#alarmText");
	if(getAlarm() === null)
		alarmText.innerHTML = "Set Alarm";
	else {
		var currentAlarm = $q("#currentAlarm");
		currentAlarm.className = "alarmText display";
		currentAlarm.innerHTML = getAlarm() + ' <img src="alarm.png" alt="Alarm ON" height="27" width="27">';
		alarmText.innerHTML = "Reset Alarm";
	}
}

// update the alarm
function updateAlarm() {
	var alarmSet = $q("#alarmSet"),
		alarmText = $q("#alarmText"),
		currentAlarm = $q("#currentAlarm"),
		newAlarmInput = $q("#newAlarmInput");

	alarmSet.className  = "alarmSet display";
	alarmText.className = "alarmText hide";
	currentAlarm.className = "alarmText hide";
	newAlarmInput.value = getAlarmUTC();
	sessionStorage.setItem("lastAlarm", null);  // clear the alarm in session
}



function setOrResetAlarm() {
	var currentAlarm = getAlarm();
	if(currentAlarm !== null)
	{
		//reset alarm
		sessionStorage.setItem("lastAlarm", null);

		var currentAlarm = $q("#currentAlarm"),
			alarmText = $q("#alarmText");

		currentAlarm.className = "alarmText hide";
		alarmText.innerHTML = "Set Alarm";
	}
	else
	{
		//set alarm
		var alarmSet = $q("#alarmSet"),
			alarmText = $q("#alarmText");

		alarmSet.className = "alarmSet display";
		alarmText.className = "alarmText hide";
	}
}


function setAlarm() {
	var newAlarmInput = $q("#newAlarmInput");
	if(newAlarmInput.value == "")
		alert("Format incorrect");
	else {
		var alarmText = $q("#alarmText"),
			alarmSet = $q("#alarmSet"),
			currentAlarm = $q("#currentAlarm");

		alarmText.className = "alarmText display";
		alarmText.innerHTML = "Reset Alarm";
		alarmSet.className = "alarmSet hide";
		sessionStorage.setItem("lastAlarm", newAlarmInput.value);  //set the new Alarm in session
		currentAlarm.className = "alarmText display";
		currentAlarm.innerHTML = getAlarm() + ' <img src="alarm.png" alt="Alarm ON" height="27" width="27">';
	}
}

// check that the time of the alarm has arrived
function checkAlarm() {
	if(getAlarm() !== null) {
		var alarm = new Date(sessionStorage.getItem("lastAlarm")),
			now = new Date();
			now.setSeconds(0);

		if(now.getTime() > alarm.getTime()) {
			//play sound
			var audio = new Audio('alarm.mp3');
			audio.play();

			//stock the current alarm in a second variable for the snooze
			sessionStorage.setItem("lastAlarmBackup", alarm);
			//remove the current alarm to remove the display
			sessionStorage.setItem("lastAlarm", null);

			var currentAlarm = $q("#currentAlarm"),
				alarmText   = $q("#alarmText"),
				cancelAlarm = $q("#cancelAlarm"),
				snoozeAlarm = $q("#snoozeAlarm");

			currentAlarm.className = "alarmText hide";
			alarmText.className = "alarmText hide";
			cancelAlarm.className = "alarmText display";
			snoozeAlarm.className = "alarmText display";
		}
	}
}

function cancelAlarm() {
	var cancelAlarm = $q("#cancelAlarm"),
		snoozeAlarm = $q("#snoozeAlarm"),
		newAlarmInput = $q("#newAlarmInput"),
		alarmText   = $q("#alarmText");

	cancelAlarm.className = "alarmText hide";
	snoozeAlarm.className = "alarmText hide";
	newAlarmInput.value = "";
	alarmText.className = "alarmText display";
	alarmText.innerHTML = "Set Alarm";

	updateTextAlarm();
}

function snoozeAlarm() {
	var snoozeMinutes = 10,
		alarm = new Date(sessionStorage.getItem("lastAlarmBackup")),
		newAlarm = new Date(alarm.getTime() + snoozeMinutes*60000); // 60 seconds * 1000 milliseconds

	// Put the new alarm in session
	sessionStorage.setItem("lastAlarm", newAlarm);

	var cancelAlarm = $q("#cancelAlarm"),
		snoozeAlarm = $q("#snoozeAlarm"),
		alarmText   = $q("#alarmText");

	cancelAlarm.className = "alarmText hide";
	snoozeAlarm.className = "alarmText hide";
	alarmText.className = "alarmText display";
	alarmText.innerHTML = "Reset Alarm";


	updateTextAlarm();
}

function updateAll() {
	// update the clock
	update($q(".clock1"));
	// update the text of the alarm according to the session
	updateTextAlarm();
	// check if it's time to ring
	checkAlarm();
}   

var $clocks = $q(".clocks");
// update everything the first time
updateAll();
// and update everything every second
setInterval(updateAll, 1000);
