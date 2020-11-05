class Bet {
	// just three numbers
	constructor(player, amount, value) {
		this.player = player;
		this.amount = amount;
		this.value = value;
	}
}

// return true if newBet is valid raise, else false
// if no old bet, return true
function betIsValid(oldBet, newBet) {
	return (oldBet == null) || (newBet.amount > oldBet.amount) || 
		(newBet.amount == oldBet.amount && newBet.value > oldBet.value);
}

// for printing current bet
function getBetStr(no_plural = false) {
	return currentBet.amount + ' ' + currentBet.value + (!no_plural && currentBet.amount > 1 ? 's' : '');
}