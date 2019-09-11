// return random int between min and max, inclusive
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// return a hand of size size. hand is array of ints
function getHand(size) {
	let hand = [];
	for(let i=0; i<size; i++)
		hand[i] = random(1,6);
	return hand;
}

// return the number of times num (or 1) appears in hands
function getCount(hands, num) {
	let count = 0;
	for(let i=0; i<hands.length; i++) {
		for(let j=0; j<hands[i].length; j++) {
			if(hands[i][j]==num || hands[i][j]==1)
				count++;
		}
	}
	return count;
}

// count number of dice total
function numDice(hands) {
	let count = 0;
	for(let i=0; i<hands.length; i++)
		count += hands[i].length;
	return count;
}

// return -1 if game isn't over, otherwise playerNum of winner
function checkGameOver(hands) {
	let numPlayers = 0;
	let winnerIdx;
	for(let i=0; i<hands.length; i++) {
		if(hands[i].length!=0) {
			numPlayers++;
			winnerIdx = i;
		}
	}
	if(numPlayers!=1)
		return -1;
	return winnerIdx+1;
}