let user, signedIn = false;

// https://firebase.google.com/docs/auth/web/google-signin
function signin() {
	let provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		let token = result.credential.accessToken;

		user = result.user;

		console.log(token);
		console.log(user);
		console.log(user.displayName);
		console.log(user.email);
		console.log(user.photoURL);
		console.log(user.uid);

		showProfileInfo(user.displayName, user.photoURL);

		$('#sign-in-btn').css('display', 'none');
		$('#sign-out-btn').css('display', 'inline');
		$('#toast').html('');

		signedIn = true;

	}).catch(function(err) {
		// let errorCode = err.code;
		// let errorMessage = err.message;
		// let email = err.email;
		// let credential = err.credential; // The firebase.auth.AuthCredential type that was used.
		console.log(err);

		$('#toast').html('error signing in');
		setTimeout(()=> $('#toast').html(''),3000);

	});
}
function signout() {
	firebase.auth().signOut().then(function() {

		$('#sign-in-btn').css('display', 'inline');
		$('#sign-out-btn').css('display', 'none');
		$('#toast').html('sign-out successful');
		setTimeout(()=> $('#toast').html(''),3000);

		hideProfileInfo();

		console.log('Sign-out successful.');

		signedIn = false;

	}).catch(function(err) {
		
		$('#toast').html('sign-out error');
		setTimeout(()=> $('#toast').html(''),3000);

		console.log('Sign-out error.');
		console.log(err);

	});
}

function showProfileInfo(name, src) {
	$('#profile-info').css('display', 'inline');
	$('#profile-name').html(name);
	$('#profile-img').prop('src', src);
}
function hideProfileInfo() {
	$('#profile-info').css('display', 'none');
	$('#profile-name').html('');
	$('#profile-img').prop('src', '');
}