// globals

let playerHands = []; // array of hands
let currentBet, currentPlayer; // bet object and player number

// game functions

function newGame(numPlayers) {
	for(let i=0; i<numPlayers; i++)
		playerHands.push([0,0,0,0,0]);

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
	let winner = checkGameOver(playerHands);
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

// render functions

let numNames = 'zero one two three four five six'.split(' ');
function renderHand(hand, playerNum, elm) {
	let handHTML = '';
	for(let i=0; i<hand.length; i++) {
		if(hand[i]!=-1)
			handHTML += '<i class="dice-icon fas fa-dice-' + numNames[hand[i] ] + '"></i> ';
		else
			handHTML += '<i class="dice-icon fas fa-square"></i> ';
	}
	elm.append('Player ' + playerNum + ': ' + handHTML + '<br>');
}

function renderHands(renderAll=false, elm=$('#player-hands'), clear=true) {
	if(clear) elm.html('');
	for(let i=0; i<playerHands.length; i++) {
		if(currentPlayer==i+1 || renderAll)
			renderHand(playerHands[i], i+1, elm);
		else
			renderHand(new Array(playerHands[i].length).fill(-1), i+1, elm);
	}
}

function renderInfo() {
	$('#info-p').html('Player ' + currentPlayer + '\'s turn');
	if(currentBet!=null)
		$('#info-p').append('<br><br>Current bet: Player ' + currentBet.player + ' bet ' + getBetStr() );
}

// end of round behaviors

function playerLose(playerNum, count, isSpot = false) {
	playerHands[playerNum-1].pop();
	currentPlayer = playerNum;

	$('#message-p').html('Player ' + playerNum + ' lost ' + (isSpot ? 'their spot on' : 'on bet') + 
		' of ' + getBetStr() + '. There ' + (count == 1 ? 'was' : 'were') + ' ' + count + '.<br>');
	endRound();
}

function playerWin(playerNum) {
	for(let i=0; i<playerHands.length; i++) {
		if(i != playerNum-1)
		playerHands[i].pop();
	}
	currentPlayer = playerNum;

	$('#message-p').html('Player ' + playerNum + ' won their spot on of ' + getBetStr() + '.<br>');
	endRound();
}

function endRound() {
	$('#main-body').css('display','none');
	
	$('#end-display-p').css('display','');
	$('#end-display-p').html('');
	renderHands(true, $('#end-display-p'), false);
}
