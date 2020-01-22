$( ()=> {

	// bet modal

	$('#raise-btn').click( ()=> {
		$('#bet-modal').modal('show');
	});

	$('#back-bet-btn').click( ()=> {
		$('#bet-modal').modal('hide');
	});

	$('#submit-bet-btn').click( ()=> {
		if(betIsValid(currentBet, new Bet(-1, $('#bet-amount-select').val(), $('#bet-value-select').val() ) ) ) {
			$('#message-p').html('');
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

	// call btn

	$('#call-btn').click( ()=> {
		$('#message-p').html('');
		let count = getCount(playerHands, currentBet.value);
		if(currentBet.amount > count)
			playerLose(currentBet.player, count);
		else
			playerLose(currentPlayer, count);
		newRound();
	});

	// spot btn

	$('#spot-btn').click( ()=> {
		$('#message-p').html('');
		let count = getCount(playerHands, currentBet.value);
		if(currentBet.amount == count)
			playerWin(currentPlayer);
		else
			playerLose(currentPlayer, count, true);
		newRound();
	});

	// continue btn

	$('#continue-btn').click( ()=> {
		$('#main-body').css('display','');
		$('#continue-btn').css('display','none');
		$('#raise-btn').focus();
		$('#end-display-p').css('display','none');
	});

	// quick increment btns

	$('#bet-amount-increment-btn').click( ()=> {
		let curVal = parseInt($('#bet-amount-select').val() );
		if(curVal < numDice(playerHands) )
			$('#bet-amount-select').val(curVal+1);
	});

	$('#bet-value-increment-btn').click( ()=> {
		let curVal = parseInt($('#bet-value-select').val() );
		if(curVal < 6) {
			$('#bet-value-select').val(curVal+1);
		}
		else if(parseInt($('#bet-amount-select').val() ) < numDice(playerHands) ) {
			$('#bet-value-select').val(2);
			$('#bet-amount-increment-btn').click();
		}
	});

	// modal show/hide listeners, focus correct input

	$('#bet-modal').on('shown.bs.modal', (e)=> {
		$('#bet-amount-select').focus();
	});
	$('#bet-modal').on('hidden.bs.modal', (e)=> {
		$('#raise-btn').focus();
	});
	$('#new-game-modal').on('shown.bs.modal', (e)=> {
		$('#num-players-select').focus();
	});
	$('#new-game-modal').on('hidden.bs.modal', (e)=> {
		$('#new-game-btn').focus();
	});

	$('#settings-modal').on('shown.bs.modal', (e)=> {
		$('#settings-tab').focus();
	});

	// new game listeners

	$('#new-game-btn').click( ()=> {
		$('#new-game-modal').modal('show');
	});

	$('#begin-game-btn').click( ()=> {
		// num players, dice per player
		newGame(parseInt($('#num-players-select').val() ), parseInt($('#num-dice-select').val() ) );
		$('#new-game-modal').modal('hide');
	});

	// setup for new game

	$('#new-game-modal').modal('show');
	$('#continue-btn').css('display','none');
	$('#main-body').css('display','none');

	// settings

	$('#clear-history-btn').click( ()=> {
		$('#history-span').html('');
	});

	$('#reset-settings-btn').click( ()=> {
		$('#num-dice-select').val('5');
	});

	$('#end-game-btn').click(endGame);

	$('#fullscreen-btn').click(toggleFullscreen);

	// misc setup

	makeNumDropdown($('#num-dice-select'), 20, 5);

	$('#rules-carousel').carousel('pause');

	// backup
	$('#rules-carousel').on('slid.bs.carousel', ()=> {
		$('#rules-carousel').carousel('pause');	
	});

	$('#sign-in-btn').click(signin);
	$('#sign-out-btn').click(signout);
	
});

document.addEventListener('DOMContentLoaded', ()=> {
	// firebase stuff. just logging for now.
	try {
		let app = firebase.app();
		let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
		console.log(`Firebase SDK loaded with ${features.join(', ')}`);
	} catch(err) {
		console.log('Error loading the Firebase SDK.');
		console.error(err);
	}
});
