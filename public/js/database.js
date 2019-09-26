// addGameToDB(['gamestart','round 13346 22444 23566','1 bet 2 5','2 bet 3 5','3 call','3 lose','gameover'], ['joe','bill','tom'], 'bill');
// playerList is a list of strings which are player names saved on the user's account
// winner is the player name string, one of the players in playerList
// gameLog is an array of strings acting like a log file for the game
function addGameToDB(gameLog, playerList, winner) {
	firebase.database().ref('games').push({[user.uid]: gameLog});

	if(!signedIn) return;

	for(player in playerList) {
		if(playerList[player]==winner) {
			setPlayerWinLoss(playerList[player], true);
		} else {
			setPlayerWinLoss(playerList[player], false);
		}
	}
}

function getPlayerData(playerName) {
	firebase.database().ref('users/'+user.uid).once('value').then(function(snapshot) {
		if(snapshot.val()[playerName]) {
			return [snapshot.val()[playerName].wins, snapshot.val()[playerName].losses];
		} else {
			return [0,0];
		}
	});
}

function setPlayerWinLoss(playerName, win) {
	firebase.database().ref('users/'+user.uid).once('value').then(function(snapshot) {
		let w=0, l=0;
		if(snapshot.val()[playerName]) { // exists
			w = snapshot.val()[playerName].wins;
			l = snapshot.val()[playerName].losses;
		}
		// else defaults to 0 from above

		if(win)
			w++
		else
			l++;

		firebase.database().ref('users/'+user.uid+'/'+playerName).set({
			wins: w,
			losses: l
		});

	});
}

function removePlayerData() {
	if(!signedIn) return -1;

	firebase.database().ref('users/'+user.uid).remove();
}
