// globals

let playerHands = []; // array of hands
let currentBet, currentPlayer; // bet object and player number

// for upload to db
let gameHistory = [];
let gamePlayers = -1;
let gameDice = -1;

// game functions

function newGame(numPlayers, numDice=5) {
	currentPlayer = 1;
	playerHands = [];

	for(let i=0; i<numPlayers; i++)
		playerHands.push(new Array(numDice).fill(0) );

	$('#bet-modal').modal('hide');
	$('#continue-btn').css('display','none');
	$('#new-game-btn').css('display','none');
	$('#message-p').html('');

	newRound(true);
	$('#continue-btn').click();
	$('#main-body').css('display','');

	// history only
	addHistory('Started new game with ' + numPlayers + ' players');

	// for db
	gamePlayers = numPlayers;
	gameDice = numDice;
}

function newRound(justStarted=false) {
	let winner = checkGameOver(playerHands);
	if(winner != -1) {
		let str = 'Player ' + winner + ' wins!';
		addHistory('<hr>' + str);
		$('#info-p').html(str);

		$('#new-game-btn').css('display','').focus();

		// for db
		gameHistory.push('p' + winner + ' wins');
		uploadGame(gamePlayers, gameDice, gameHistory);
		gameHistory = [];
		gamePlayers = gameDice = -1;

		return;
	}

	// --------------------------------

	$('#continue-btn').css('display','').focus();

	for(let i=0; i<playerHands.length; i++)
		playerHands[i] = getHand(playerHands[i].length);

	renderHands();
	currentBet = null;
	renderInfo();

	$('#call-btn').prop('disabled', true);
	$('#spot-btn').prop('disabled', true);

	makeNumDropdown($('#bet-amount-select'), numDice(playerHands) );
	$('#bet-amount-select').val('1');
	$('#bet-value-select').val('2');

	// history only
	if(!justStarted) {
		let str = 'New Round: ';
		for(let i=0; i<playerHands.length; i++)
			str += 'Player ' + (i+1) + ' has ' + playerHands[i].length + ' dice. ';
		addHistory(str);
	}

	gameHistory.push('hands: ' + getHandStringsPlain() );
}

function nextPlayer() {
	do {
		currentPlayer++;
		if(currentPlayer > playerHands.length)
			currentPlayer = 1;
	} while(playerHands[currentPlayer-1].length==0);

	$('#main-body').css('display','none');
	$('#continue-btn').css('display','').focus();
}

// render functions

const NUM_NAMES = 'zero one two three four five six'.split(' ');

function getHandString(hand, playerNum, focusVal=-1) {
	let handHTML = '';
	for(let i=0; i<hand.length; i++) {
		if(hand[i]!=-1)
			handHTML += '<i class="dice-icon ' + (hand[i]==focusVal ? 'focus ' : '') + 'fas fa-dice-' + NUM_NAMES[hand[i] ] + '"></i> ';
		else
			handHTML += '<i class="dice-icon fas fa-square"></i> ';
	}
	return 'Player ' + playerNum + ': ' + handHTML + '<br>';
}

function getHandStrings() {
	let rtn = '';
	for(let i=0; i<playerHands.length; i++) {
		rtn += getHandString(playerHands[i], i+1, currentBet.value);
	}
	return rtn.slice(0,-4); // cut off last <br>
}

function getHandStringsPlain() {
	let rtn = '';
	for(let i=0; i<playerHands.length; i++) {
		rtn += 'p' + (i+1) + ': ';
		for(let j=0; j<playerHands[i].length; j++) {
			rtn += playerHands[i][j];
		}
		rtn += ', ';
	}
	return rtn.slice(0,-2); // cut trailing comma
}

function renderHand(hand, playerNum, elm, focusVal=-1) {
	elm.append(getHandString(hand, playerNum, focusVal) );
}

function renderHands(renderAll=false, elm=$('#player-hands'), focusVal=-1) {
	elm.html('');
	for(let i=0; i<playerHands.length; i++) {
		if(currentPlayer==i+1 || renderAll)
			renderHand(playerHands[i], i+1, elm, focusVal);
		else
			renderHand(new Array(playerHands[i].length).fill(-1), i+1, elm);
	}
}

function renderInfo() {
	$('#info-p').html('Player ' + currentPlayer + '\'s turn');

	$('#continue-span').html(' <small>(to Player ' + currentPlayer + ')</small>');

	if(currentBet!=null) {
		let str = 'Player ' + currentBet.player + ' bet ' + getBetStr();
		$('#info-p').append('<br><br>Current bet: ' + str);
		addHistory(str);
		gameHistory.push('p' + currentBet.player + ' bet ' + getBetStr(true) );
	}
}

// end of round behaviors

function playerLose(playerNum, count, isSpot = false) {
	endRound();
	playerHands[playerNum-1].pop();
	currentPlayer = playerNum;

	let str = 'Player ' + playerNum + ' lost ' + (isSpot ? 'their spot on' : 'on their bet') + 
		' of ' + getBetStr() + '. There ' + (count == 1 ? 'was' : 'were') + ' ' + count + '.';
	$('#message-p').html(str);
	addHistory(str);
	addHistory(getHandStrings() );
	gameHistory.push('p' + playerNum + ' lost ' + (isSpot ? ' spot ' : ' bet ') + getBetStr(true) );
}

function playerWin(playerNum) {
	endRound();
	for(let i=0; i<playerHands.length; i++) {
		if(i != playerNum-1)
			playerHands[i].pop();
	}
	currentPlayer = playerNum;

	let str = 'Player ' + playerNum + ' won their spot on of ' + getBetStr() + '.<br>';
	$('#message-p').html(str);
	addHistory(str);
	addHistory(getHandStrings() );
	gameHistory.push('p' + playerNum + ' won spot ' + getBetStr(true) );
}


function endRound() {
	$('#main-body').css('display','none');
	
	$('#end-display-p').css('display','');
	renderHands(true, $('#end-display-p'), currentBet.value);
}

// called only by end game button
// to end game prematurely
function endGame() {
	$('#main-body').css('display','none');
	$('#continue-btn').css('display','none');
	$('#end-display-p').html('');
	$('#info-p').html('');
	$('#new-game-btn').css('display','').focus();
	addHistory('<hr>Game ended by user.');
}

// db

document.addEventListener('DOMContentLoaded', function() {
	try {
		let app = firebase.app();
	} catch (e) {
		console.log('Error loading the Firebase SDK.');
		console.error(e);
	}
});

function uploadGame(dice, players, history) {
	const db = firebase.firestore();
	db.collection('games').add({
		dice: dice,
		players: players,
		date: Date.now(),
		history: history
	});
}
