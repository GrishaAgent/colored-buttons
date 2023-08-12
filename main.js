"use strict";

// ==================
// variables
// ==================

const colors = {
	red: "button- color - red",
	green: "button-color-green",
	blue: "button-color-blue",
	default: "button-color-default"
};
let currentColor = "";

const gameStates = {
	gameRuns: "gameRuns",
	gameOver: "gameOver",
	roundRuns: "roundRuns",
	roundOver: "roundOver",
	listenningPaletteButtons: "listenningPaletteButtons",
	listenningGameButtons: "listenningGameButtons",
	checkingResults: "checkingResults"
};
let currentGameStates = [];

const gameButtonsNumber = 5;



// ==================
// functions
// ==================

function removeArrayElementByValue(array, value) {
	let index = array.indexOf(value);
	array.splice(index, 1);
}

function sleep(func,ms) {
	return new Promise(resolve => setTimeout(func,ms));
}

async function executeFunctionWithSleep(func,ms) {
	await sleep(func,ms);
}

function countdownTimer(seconds, endFunction) {
	const startTime = Date.now();

	const intervalId = setInterval(function () {

		const elapsedTime = Date.now() - startTime;
		const remainingTime = seconds * 1000 - elapsedTime;

		var timer = document.getElementById("game-timer");

		if (remainingTime <= 0) {
			clearInterval(intervalId);
			timer.style.color = "red";
			endFunction();
		} else {
			timer.innerText = Math.floor(remainingTime / 1000);
		}
	},500);
}

