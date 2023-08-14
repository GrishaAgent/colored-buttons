// Current errors (from console):
// Uncaught TypeError: button.classList[1].remove is not a function
    // at setCurrentColorToButton(main.js: 126: 22)
    // at HTMLButtonElement.gameButtonOnClick(main.js: 167: 2)
// Uncaught ReferenceError: correctAnswersForAllRounds is not defined
    // at showGameResults(main.js: 150: 22)
    // at timerIsUp(main.js: 207: 2)
    // at main.js: 89: 4

"use strict";

// ====================================
// variables
// ====================================

const colors = {
	red: "button-color-red",
	green: "button-color-green",
	blue: "button-color-blue",
	default: "button-color-default"
};
let currentColor = "";
let roundColors = [];

// const gameStates = {
// 	gameRuns: "gameRuns",
// 	gameOver: "gameOver",
// 	roundRuns: "roundRuns",
// 	roundOver: "roundOver",
// 	listenningPaletteButtons: "listenningPaletteButtons",
// 	listenningGameButtons: "listenningGameButtons",
// 	checkingResults: "checkingResults"
// };
// let currentGameStates = [];
let gameOn = false;

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
let paletteButtons = document.getElementsByClassName(buttonTypes.paletteButton);

let correctAnswersCountPerRounds = [];

// ====================================
// functions
// ====================================

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

function setCurrentColorToButton(button) {
	button.classList[1].remove();
	button.classList.add(currentColor);
}

function saveCorrectAnswersCountPerRound() {
	let correctAnswersCount = 0;
	let buttonColors = getGameButtonsColors();

	for (let i = 0; i < gameButtonsNumber; i++) {
		if (buttonColors[i] == roundColors[i]) {
			correctAnswersCount++;
		}
	}

	correctAnswersCountPerRounds.push(correctAnswersCount);
}

function showGameResults() {
	let resultsBox = document.getElementById("results-box");
	resultsBox.style.visibility = "visible";

	let absoluteResults = document.getElementById("results-absolute");
	let relativeResults = document.getElementById("results-relative");

	for (let i = 0; i < correctAnswersForAllRounds.length; i++) {
		absoluteResults.innerText += (String(correctAnswersCountPerRounds[i]) + ", ");
		relativeResults.innerText += (String(correctAnswersCountPerRounds[i] / gameButtonsNumber * 100) + "%, ");
	}
}

function checkEndOfRound() {
	let gameButtonsColors = getGameButtonsCurrentColors();
	if (!gameButtonsColors.includes(colors.default)) {
		saveCorrectAnswersCountPerRound();
		roundColors = [];
		currentColor = "";
	}
}

function gameButtonOnClick(event) {
	let button = event.srcElement;
	setCurrentColorToButton(button);
	removeGameButtonsEventListeners();

	checkEndOfRound();
}

function removeGameButtonsEventListeners() {
	for (let button of gameButtons) {
		button.removeEventListener("click", gameButtonOnClick);
	}
}

function addAllGameButtonsEventListeners() {
	for (let button of gameButtons) {
		button.addEventListener("click",gameButtonOnClick);
	}
}

function paletteButtonOnClick(event) {
	let button = event.srcElement;
	currentColor = button.classList[1];
	addAllGameButtonsEventListeners();
	removePaletteButtonsEventListeners();
}

function removePaletteButtonsEventListeners() {
	for (let button of paletteButtons) {
		button.removeEventListener("click", paletteButtonOnClick);
	}
}

function addAllPaletteButtonsEventListeners() {
	for (let button of paletteButtons) {
		button.addEventListener("click",paletteButtonOnClick);
	}
}

function timerIsUp() {
	removeGameButtonsEventListeners();
	removePaletteButtonsEventListeners();
	showGameResults();
}

function newRound() {
	if (!gameOn) {
		countdownTimer(60, timerIsUp);
		gameOn = true;
	}

	setRandomRoundColors();
	setRoundColorsToGameButtons();
	executeFunctionWithSleep(setDefaultColorToGameButtons, 2000);
	addAllPaletteButtonsEventListeners();
}

// ====================================
// globally executed code
// ====================================

let startButton = document.getElementById("start-button");
startButton.addEventListener("click", newRound);