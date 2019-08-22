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
	newGame(3);

	$('#raise-btn').click( ()=> {
		$('#bet-modal').modal('show');
	}).focus();

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

	$('#bet-modal').on('shown.bs.modal', (e) => {
		$('#bet-amount-select').focus();
	});

	$('#bet-modal').on('hidden.bs.modal', (e) => {
		$('#raise-btn').focus();
	});
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

	newRound();
}

function newRound() {
	for(let i=0; i<playerHands.length; i++) {
		playerHands[i] = getHand(playerHands[i].length);
	}

	renderHands();
	currentBet = null;
	renderInfo();

	$('#call-btn').prop('disabled', true);
	$('#spot-btn').prop('disabled', true);

	$('#bet-amount-select').val('1');
	$('#bet-value-select').val('2');
}

function nextPlayer() {
	currentPlayer++;
	if(currentPlayer > playerHands.length+1)
		currentPlayer = 1;

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
	$('#continue-btn').css('display','').focus();
}

function playerWin(playerNum) {
	for(let i=0; i<playerHands.length; i++) {
		if(i != playerNum-1)
		playerHands[i].pop();
	}

	currentPlayer = playerNum;

	$('#message-p').html('Player ' + playerNum + ' won their spot');
	$('#main-body').css('display','none');
	$('#continue-btn').css('display','').focus();
}