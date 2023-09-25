'use strict';
const RPSChoice = Object.freeze({
	Rock: 0,
	Paper: 1,
	Scissors: 2
});

const GameResultEnum = Object.freeze({
	Lose: 0,
	Draw: 1,
	Win: 2
});

const GameObject =
{
	gameResult: '',
	playerScoreAdd: 0,
	compScoreAdd: 0,
	playerScore: 0,
	computerScore: 0,
	round: 0,
	updateGame: function () {
		this.round++;
		this.playerScore += this.playerScoreAdd;
		this.computerScore += this.compScoreAdd;
	}
};

let playerSelection = 0;
let computerSelection = 0;

//	LOGIC - MODEL

function getComputerSelection () {
	return Math.floor(Math.random() * 3);
	//    return Object.keys(RPSChoice)[choice];
}

function invertResult (res) {
	return Math.abs(res - 2);
}

function playRound (playerSelection) {
	computerSelection = getComputerSelection();
	if (playerSelection === computerSelection) {
		GameObject.gameResult = GameResultEnum.Draw;
		GameObject.playerScoreAdd = 0;
		GameObject.compScoreAdd = 0;
	} else if ((playerSelection - computerSelection === 1) || (playerSelection === 0 && computerSelection === 2)) {
		GameObject.gameResult = GameResultEnum.Win;
		GameObject.playerScoreAdd = 1;
		GameObject.compScoreAdd = 0;
	} else {
		GameObject.gameResult = GameResultEnum.Lose;
		GameObject.playerScoreAdd = 0;
		GameObject.compScoreAdd = 1;
	}
	GameObject.updateGame();
}

//	DOM - VIEW

const selButtons = document.querySelectorAll('.player-selection>button');
const game = document.querySelector('.main-container .game');
const resultPlayer = document.querySelector('.result.player');
const resultMatch = document.querySelector('.result.match');
const resultComp = document.querySelector('.result.comp');
const scorePlayer = document.querySelector('.score.player');
const scoreComp = document.querySelector('.score.comp');
const restartBtn = document.querySelector('button.restart');

function clearColorClasses (element) {
	element.classList.remove('color-win');
	element.classList.remove('color-lose');
	element.classList.remove('color-draw');
}

function updateGameState () {
	game.textContent = `${Object.keys(RPSChoice)[playerSelection]} : ${Object.keys(RPSChoice)[computerSelection]}`;
	resultPlayer.textContent = `${Object.keys(GameResultEnum)[GameObject.gameResult]}!`;
	clearColorClasses(resultPlayer);
	resultPlayer.classList.add(`color-${Object.keys(GameResultEnum)[GameObject.gameResult].toLowerCase()}`);

	resultComp.textContent = `${Object.keys(GameResultEnum)[invertResult(GameObject.gameResult)]}!`;
	clearColorClasses(resultComp);
	resultComp.classList.add(`color-${Object.keys(GameResultEnum)[invertResult(GameObject.gameResult)].toLowerCase()}`);

	scorePlayer.textContent = GameObject.playerScore;
	scoreComp.textContent = GameObject.computerScore;
	if (GameObject.round >= 5) {
		selButtons.forEach((key) => {
			key.classList.add('disabled');
		});
		if (GameObject.playerScore > GameObject.computerScore) {
			resultMatch.textContent = 'You won!';
		} else if (GameObject.playerScore < GameObject.computerScore) {
			resultMatch.textContent = 'You lost!';
		} else {
			resultMatch.textContent = 'Draw!';
		}
		restartBtn.style.display = 'initial';
	}
}

function resetGameState () {
	GameObject.playerScore = 0;
	GameObject.computerScore = 0;
	GameObject.round = 0;
	game.textContent = '';
	resultPlayer.textContent = '';
	resultComp.textContent = '';
	resultMatch.textContent = '';
	scorePlayer.textContent = GameObject.playerScore;
	scoreComp.textContent = GameObject.computerScore;

	selButtons.forEach((key) => {
		key.classList.remove('disabled');
	});
	restartBtn.style.display = 'none';
}

function clickPlayRound (evt) {
	playerSelection = evt.currentTarget.sel;
	playRound(evt.currentTarget.sel);
	updateGameState();
}

selButtons.forEach((key, value) => {
	key.sel = value;
	key.addEventListener('click', clickPlayRound);
});

restartBtn.addEventListener('click', resetGameState);
