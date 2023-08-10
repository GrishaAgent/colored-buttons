// TODO: chosen game button colors are save in the order in which they are chosen (if we have correct colors and order but reversed choosing, results will not be accepted as correct)
// TODO: coloring of game buttons between rounds does not work correctly
// NOTE: `colorClassesFromClickedGameButtons` is saving colors in order of clicking, not in order of game buttons placement

"use strict";

// ------ variables ------

// --- test ---
// let predefinedColors1 = ["button-color-red", "button-color-red", "button-color-green", "button-color-green", "button-color-blue"];
// let predefinedColors2 = ["button-color-green", "button-color-green", "button-color-blue", "button-color-blue", "button-color-red"];
// let predefinedColorsSwitch = true;
// console.log("predefinedColors1:", predefinedColors1);
// console.log("predefinedColors2:", predefinedColors2);
// --- test ---

let buttonsColorClasses = ["button-color-red", "button-color-green", "button-color-blue"];
let defaultButtonColorClass = "button-color-default";
let paletteButtons = document.getElementsByClassName("color-palette-button");
let gameButtons = document.getElementsByClassName("game-button");

let gameBegan = false;

const gameButtonsNumber = 5;
let markedButtonsCounter = 0;
let clickedGameButtons = [null, null, null, null, null];
let colorClassesFromClickedGameButtons = ["", "", "", "", ""];

let correctAnswersForAllRounds = [];

let chosenPaletteButtonColorClass = "";
let generatedGameButtonColorClassesPerRound = [];

// ------ functions ------

function sleep(func, ms) {
	return new Promise(resolve => setTimeout(func, ms));
}

async function executeFunctionWithSleep(func, ms) {
	await sleep(func, ms);
}

function setGeneratedGameButtonColorClassesPerRound() {
	generatedGameButtonColorClassesPerRound = [];
	for (let i = 0; i < gameButtonsNumber; i++) {
		let chosenColorClass = buttonsColorClasses[Math.floor(Math.random() * buttonsColorClasses.length)];
		generatedGameButtonColorClassesPerRound.push(chosenColorClass);
	}

	// generatedGameButtonColorClassesPerRound = [];
	// for (let i = 0; i < gameButtonsNumber; i++) {
	// 	let chosenColorClass = "";
	// 	if (predefinedColorsSwitch) {
	// 		chosenColorClass = predefinedColors1[i];
	// 	} else {
	// 		chosenColorClass = predefinedColors2[i];
	// 	}
	// 	generatedGameButtonColorClassesPerRound.push(chosenColorClass);
	// }
	// predefinedColorsSwitch = !predefinedColorsSwitch;
}

function setGameButtonsColors() {
	for (let i = 0; i < gameButtonsNumber; i++) {
		gameButtons[i].classList.remove(defaultButtonColorClass);
		gameButtons[i].classList.add(generatedGameButtonColorClassesPerRound[i]);
	}
}

function setDefaultGameButtonsColors() {
	for (let i = 0; i < gameButtonsNumber; i++) {
		gameButtons[i].classList.remove(generatedGameButtonColorClassesPerRound[i]);
		gameButtons[i].classList.add(defaultButtonColorClass);
	}
}

function gameOver() {
	// removes all event listeners & resets styles
	for (let button of paletteButtons) {
		let newButton = button.cloneNode(true);
		button.parentNode.replaceChild(newButton, button);
	}

	for (let button of gameButtons) {
		let newButton = button.cloneNode(true);
		button.parentNode.replaceChild(newButton, button);
	}


	let resultsBox = document.getElementById("results-box");
	resultsBox.style.visibility = "visible";

	let absoluteResults = document.getElementById("results-absolute");
	let relativeResults = document.getElementById("results-relative");

	for (let i = 0; i < correctAnswersForAllRounds.length; i++) {
		absoluteResults.innerText += (String(correctAnswersForAllRounds[i]) + ", ");
		relativeResults.innerText += (String(correctAnswersForAllRounds[i] / gameButtonsNumber * 100) + "%, ");
	}
}

function countdownTimer(seconds) {
	const startTime = Date.now();

	const intervalId = setInterval(function() {
		
		const elapsedTime = Date.now() - startTime;
		const remainingTime = seconds * 1000 - elapsedTime;

		var timer = document.getElementById("game-timer");

		if (remainingTime <= 0) {
			clearInterval(intervalId);
			timer.style.color = "red";
			gameOver();
		} else {
			timer.innerText = Math.floor(remainingTime / 1000);
		}
	}, 500);
}

function checkAnswersPerRound() {
	console.log("noted colors of marked buttons:", colorClassesFromClickedGameButtons);
	console.log("pregenerated (etalon) colors for round:", generatedGameButtonColorClassesPerRound);
	console.log("checkAnswersPerRound()");

	let correctAnswersPerRound = 0;

	for (let i = 0; i < gameButtonsNumber; i++) {
		if (colorClassesFromClickedGameButtons[i] == generatedGameButtonColorClassesPerRound[i]) {
			correctAnswersPerRound++;
		}
	}

	return correctAnswersPerRound;
}

function gameButtonClicked(event) {
	markedButtonsCounter++;

	let clickedButton = event.srcElement;
	clickedButton.classList.remove(defaultButtonColorClass);
	clickedButton.classList.add(chosenPaletteButtonColorClass);
	let clickedButtonIndex = clickedButton.id;

	colorClassesFromClickedGameButtons[clickedButtonIndex] = chosenPaletteButtonColorClass;
	clickedGameButtons[clickedButtonIndex] = clickedButton;

	chosenPaletteButtonColorClass = "";
	stopListeningGameButtons();
	
	if (markedButtonsCounter == gameButtonsNumber) {
		correctAnswersForAllRounds.push(checkAnswersPerRound());
		
		markedButtonsCounter = 0;
		clickedGameButtons = [null,null,null,null,null];
		colorClassesFromClickedGameButtons = ["","","","",""];
		generatedGameButtonColorClassesPerRound = [];

		beginningOfTheRound();
	} else {
		listenPaletteButtons();
	}
}

function stopListeningGameButtons() {
	for (let button of gameButtons) {
		button.removeEventListener("click", gameButtonClicked);
	}
}

function listenGameButtons() {
	for (let button of gameButtons) {
		if (!clickedGameButtons.includes(button)) {
			button.addEventListener("click", gameButtonClicked);
		}
	}
}

function paletteButtonClicked(event) {
	let clickedButton = event.srcElement;
	chosenPaletteButtonColorClass = clickedButton.classList[1];
	listenGameButtons();
	stopListeningPaletteButtons();
}

function stopListeningPaletteButtons() {
	for (let button of paletteButtons) {
		button.removeEventListener("click", paletteButtonClicked);
	}
}

function listenPaletteButtons() {
	for (let button of paletteButtons) {
		button.addEventListener("click", paletteButtonClicked);
	}
}

function beginningOfTheRound() {
	console.log("=== beginningOfTheRound ===");

	setGeneratedGameButtonColorClassesPerRound();
	setGameButtonsColors();
	
	console.log("noted colors of marked buttons:", colorClassesFromClickedGameButtons);
	console.log("pregenerated (etalon) colors for round:", generatedGameButtonColorClassesPerRound);
	
	executeFunctionWithSleep(setDefaultGameButtonsColors, 2000);

	listenPaletteButtons();
}

function gameStart() {
	if (!gameBegan) {
		gameBegan = true;
		countdownTimer(60);
		beginningOfTheRound();
	}
}

// ------ globally executed code ------

let startButton = document.getElementById("start-button");
startButton.addEventListener("click", gameStart);
