
document.getElementById('eye-left').addEventListener('click', function() {
	makeGet('/search-artist?Ethan', function(data) { console.log('~', JSON.stringify(data)); });
	//makePost('add-song', '{"name":"Test","artist":"Ethan the Meh","width":4,"height":4,"matrix":[[1,1,1,1],[0,0,0,0],[0,0,0,0],[1,1,1,1]],"comments":"meh"}');
});

function makeGet(url, cb) {
	console.log('making GET', url);
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() { handleRes(req, cb); }
	req.open('GET', url);
	req.send();
}

function makePost(url, params) {
	console.log('making POST', url);
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() { console.log('POST complete'); }
	req.open('POST', url);
	req.send(params);
}

function handleRes(req, cb) {
	if (req.readyState !== XMLHttpRequest.DONE) {
		return;
	} else if (req.status === 200) {
		if (cb) cb(JSON.parse(req.responseText));
	}
}