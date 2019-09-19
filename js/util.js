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

function makeNumDropdown(elm, max, active=-1) {
	let tmpHTML = '';
	for(let i=1; i<=max; i++)
		tmpHTML += '<option value="' + i + '">' + i + '</option>';
	elm.html(tmpHTML);

	if(active != -1)
		elm.val(active);
}

function addHistory(str) {
	$('#history-span').prepend('<span>'+str+'<br></span>');
}

//https://stackoverflow.com/questions/3900701/onclick-go-full-screen
function toggleFullscreen() {
	if ((document.fullScreenElement && document.fullScreenElement !== null) ||
	 (!document.mozFullScreen && !document.webkitIsFullScreen)) {
		if (document.documentElement.requestFullScreen) {
			document.documentElement.requestFullScreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}