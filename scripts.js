function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRoll() {
	return random(1,6);
}

function getHand(size) {
	let hand = [];
	for(let i=0; i<size; i++)
		hand[i] = getRoll();
	return hand;
}

function getCount(hands, num) {
	let count = 0;
	for(let i=0; i<hands.length; i++) {
		for(let j=0; j<hands[i].length; j++) {
			if(hands[i][j]==num || hands[i][j]==1) {
				count++;
			}
		}
	}
	return count;
}

class Bet {
	constructor(player, amount, value) {
		this.player = player;
		this.amount = amount;
		this.value = value;
	}
}

function betIsValid(oldBet, newBet) {
	return (oldBet == null) || (newBet.amount > oldBet.amount) || 
		(newBet.amount == oldBet.amount && newBet.value > oldBet.value);
}

$( ()=> {
	$('#raise-btn').click( ()=> {
		$('#bet-modal').modal('show');
	});

	$('#back-bet-btn').click( ()=> {
		$('#bet-modal').modal('hide');
	});

	$('#submit-bet-btn').click( ()=> {
		if(betIsValid(currentBet, new Bet(-1, $('#bet-amount-select').val(), $('#bet-value-select').val() ) ) ) {
			currentBet = new Bet(currentPlayer, $('#bet-amount-select').val(), $('#bet-value-select').val() );
			nextPlayer();
			renderHands();
			renderInfo();
			$('#bet-modal').modal('hide');
			$('#bet-message-p').html('');

			$('#call-btn').prop('disabled', false);
			$('#spot-btn').prop('disabled', false);
		} else {
			$('#bet-message-p').html('Invalid bet');
		}

	});

	$('#call-btn').click( ()=> {
		if(currentBet.amount > getCount(playerHands, currentBet.value) )
			playerLose(currentBet.player);
		else
			playerLose(currentPlayer);
		newRound();
	});

	$('#spot-btn').click( ()=> {
		if(currentBet.amount == getCount(playerHands, currentBet.value) )
			playerWin(currentPlayer);
		else
			playerLose(currentPlayer);
		newRound();
	});

	$('#continue-btn').click( ()=> {
		$('#main-body').css('display','');
		$('#continue-btn').css('display','none');
		$('#raise-btn').focus();
	});

	$('#bet-modal').on('shown.bs.modal', (e)=> {
		$('#bet-amount-select').focus();
	});

	$('#bet-modal').on('hidden.bs.modal', (e)=> {
		$('#raise-btn').focus();
	});

	$('#new-game-modal').modal('show');

	$('#new-game-modal').on('shown.bs.modal', (e)=> {
		$('#num-players-select').focus();
	});

	$('#new-game-modal').on('hidden.bs.modal', (e)=> {
		$('#raise-btn').focus();
	});

	$('#new-game-btn').click( ()=> {
		$('#new-game-modal').modal('show');
	});

	$('#begin-game-btn').click( ()=> {
		newGame($('#num-players-select').val() );
		$('#new-game-modal').modal('hide');
	});

	newGame(0);
	$('#main-body').css('display','none');
	$('#info-p').html('');
	$('#new-game-btn').css('display','');
});

let playerHands = [];
let currentBet;
let currentPlayer;
function newGame(numPlayers) {
	for(let i=0; i<numPlayers; i++) {
		playerHands.push([0,0,0,0,0]);
	}

	currentPlayer = 1;

	$('#bet-modal').modal('hide');
	$('#continue-btn').css('display','none');
	$('#new-game-btn').css('display','none');

	$('#message-p').html('');

	newRound();
	$('#continue-btn').click();
	$('#main-body').css('display','');
}

function newRound() {
	let winner = checkGameOver();
	if(winner != -1) {
		$('#info-p').html('Player ' + winner + ' wins!');
		$('#new-game-btn').css('display','').focus();
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

	$('#bet-amount-select').val('1');
	$('#bet-value-select').val('2');
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

let numNames = 'zero one two three four five six'.split(' ');
function renderHand(hand, playerNum) {
	let handHTML = '';
	for(let i=0; i<hand.length; i++) {
		if(hand[i]!=-1)
			handHTML += '<i class="fas fa-dice-' + numNames[hand[i] ] + '"></i> ';
		else
			handHTML += '<i class="fas fa-square"></i> ';
	}

	$('#player-hands').append('Player ' + playerNum + ': ' + handHTML + '<br>');
}
function renderHands() {
	$('#player-hands').html('');
	for(let i=0; i<playerHands.length; i++) {
		if(currentPlayer==i+1)
			renderHand(playerHands[i], i+1);
		else
			renderHand(new Array(playerHands[i].length).fill(-1), i+1);
	}
}

function renderInfo() {
	$('#info-p').html('Player ' + currentPlayer + '\'s turn');
	if(currentBet!=null)
		$('#info-p').append('<br>Current bet: Player ' + currentBet.player + ' bet ' + currentBet.amount + ' ' + currentBet.value
			+ (currentBet.amount>1 ? 's' : '') );
}

function playerLose(playerNum) {
	playerHands[playerNum-1].pop();

	currentPlayer = playerNum;

	$('#message-p').html('Player ' + playerNum + ' lost their bet');
	$('#main-body').css('display','none');
}

function playerWin(playerNum) {
	for(let i=0; i<playerHands.length; i++) {
		if(i != playerNum-1)
		playerHands[i].pop();
	}

	currentPlayer = playerNum;

	$('#message-p').html('Player ' + playerNum + ' won their spot');
	$('#main-body').css('display','none');
}

// return -1 if game isn't over, otherwise playerNum of winner
function checkGameOver() {
	let numPlayers = 0;
	let winnerIdx;
	for(let i=0; i<playerHands.length; i++) {
		if(playerHands[i].length!=0) {
			numPlayers++;
			winnerIdx = i;
		}
	}
	if(numPlayers!=1)
		return -1;
	return winnerIdx+1;
}