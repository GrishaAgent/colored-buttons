"use strict";

// ==================
// variables
// ==================

const colors = {
	red: "button-color-red",
	green: "button-color-green",
	blue: "button-color-blue",
	default: "button-color-default"
};
let currentColor = "";
let roundColors = [];

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

const buttonTypes = {
	paletteButton: "palette-button",
	gameButton: "game-button"
};
const gameButtonsNumber = 5;
for (let i = 0; i < gameButtonsNumber; i++) {
	let button = document.createElement("button");
	button.classList.add(buttonTypes.gameButton);
	button.classList.add(colors.default);
	button.id = i;
	document.getElementById("game-field").appendChild(button);
}
let gameButtons = document.getElementsByClassName(buttonTypes.gameButton);


// ==================
// functions
// ==================

function removeArrayElementByValue(array, value) {
	let index = array.indexOf(value);
	if (index < 0) {
		return -1
	}

	array.splice(index, 1);
}

function getGameButtonsCurrentColors() {
	let buttonColors = [];

	for (let i = 0; i < gameButtonsNumber; i++) {
		buttonColors.push(gameButtons[String(i)].classList[1]);
	}

	return buttonColors;
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

function setRandomRoundColors() {
	for (let i = 0; i < gameButtonsNumber; i++) {
		let keys = Object.keys(colors);
		let randomKey = keys[Math.floor(Math.random()) * (keys.length - 1)];
		roundColors.push(colors[randomKey]);
	}
}

function removeAllColorsFromGameButtons() {
	for (let button of gameButtons) {
		for (let color of colors) {
			button.classList.remove(color);
		}
	}
}

function setRoundColorsToGameButtons() {
	for (let i = 0; i < gameButtonsNumber; i++) {
		gameButtons[String(i)].classList.remove(colors.default);
		gameButtons[String(i)].classList.add(roundColors[i]);
	}
}

function setDefaultColorToGameButtons() {
	for (let button of gameButtons) {
		button.classList.add(colors.default);
	}
}

function getCorrectRoundAnswersCount() {
	let correctAnswersCount = 0;
	let buttonColors = getGameButtonsColors();

	for (let i = 0; i < gameButtonsNumber; i++) {
		if (buttonColors[i] == roundColors[i]) {
			correctAnswersCount++;
		}
	}

	return correctAnswersCount;
}

