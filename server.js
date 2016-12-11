var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , dateTime = require('date-time')
  , port = 8080;

var songFilePath = 'songs.json'

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url);

  if (req.method == 'POST') {
      handlePost(req);
  } else if (req.method == 'GET') {
    console.log(uri.pathname);
    switch( uri.pathname ) {
      case '/search-song':
      case '/search-artist':
        searchSongs(res, uri);
        break;
      case '/':
      case '/index.html':
        sendFile(res, 'public/index.html');
        break;
      case '/css/style.css':
        sendFile(res, 'public/css/style.css', 'text/css');
        break;
      case '/js/scripts.js':
        sendFile(res, 'public/js/scripts.js', 'text/javascript');
        break;
      case '/images/trex2.png':
        sendFile(res, 'public/images/trex2.png');
        break;
      case '/images/trex3.png':
        sendFile(res, 'public/images/trex3.png');
        break;
      case 'README.md':
      case '/README':
        sendFile(res, 'README.md');
        break;

      case '/midi/inc/shim/Base64.js':
        sendFile(res, 'public/midi/inc/shim/Base64.js', 'text/javascript');
        break;
      case '/midi/inc/shim/Base64binary.js':
        sendFile(res, 'public/midi/inc/shim/Base64binary.js', 'text/javascript');
        break;
      case '/midi/inc/shim/WebAudioAPI.js':
        sendFile(res, 'public/midi/inc/shim/WebAudioAPI.js', 'text/javascript');
        break;
      case '/midi/js/midi/audioDetect.js':
        sendFile(res, 'public/midi/js/midi/audioDetect.js', 'text/javascript');
        break;
      case '/midi/js/midi/gm.js':
        sendFile(res, 'public/midi/js/midi/gm.js', 'text/javascript');
        break;
      case '/midi/js/midi/loader.js':
        sendFile(res, 'public/midi/js/midi/loader.js', 'text/javascript');
        break;
      case '/midi/js/midi/plugin.audiotag.js':
        sendFile(res, 'public/midi/js/midi/plugin.audiotag.js');
        break;
      case '/midi/js/midi/plugin.webaudio.js':
        sendFile(res, 'public/midi/js/midi/plugin.webaudio.js');
        break;
      case '/midi/js/midi/plugin.webmidi.js':
        sendFile(res, 'public/midi/js/midi/plugin.webmidi.js');
        break;
      case '/midi/js/util/dom_request_xhr.js':
        sendFile(res, 'public/midi/js/util/dom_request_xhr.js');
        break;
      case '/midi/js/util/dom_request_script.js':
        sendFile(res, 'public/midi/js/util/dom_request_script.js');
        break;

      default:
        sendFile(res, 'public' + uri.pathname);
        //console.log('could not find \'' + uri.pathname + '\'');
        //res.end('404 not found');
    }
  }
});

server.listen(process.env.PORT || port);

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType});
    res.end(content, 'utf-8');
  })
}

function handlePost(req) {
  var body = '';
  req.on('data', function (data) {
    body += data;
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) { 
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      req.connection.destroy();
    }
  });

  req.on('end', function () {
    //console.log('POST data', body);
    saveSong(JSON.parse(body));
  });
}

function searchSongs(res, uri) {
  res.writeHead(200, {'Content-type': 'application/json'});

  fs.readFile(songFilePath, function(err, data) {
    if (err) throw err;

    var songs = JSON.parse(data);
    if (songs['songs']) {
      songsList = songs['songs'];

      filteredSongs = [];

      for (var song in songsList) {
        if (uri.pathname == '/search-song') {
          if (songsList[song]['name'].indexOf(uri.query) > -1) {
            filteredSongs.push(songsList[song])
          }
        } else if (uri.pathname == '/search-artist') {
          if (songsList[song]['artist'].indexOf(uri.query) > -1) {
            filteredSongs.push(songsList[song])
          }
        }
      }

      // } else if (uri.pathname='sort-popular') {
      //   filteredSongs = songsList;
      //   filteredSongs.sort(function(a, b) {
      //     return a.likes - b.likes;
      //   });
      // } else if (uri.pathname='sort-recent') {
      //   filteredSongs = songsList;
      //   filteredSongs.sort(function(a, b) {
      //     if (a.date < b.date) {
      //       return -1;
      //     } else if (a.date > b.date) {
      //       return 1;
      //     } else {
      //       return 0;
      //     }
      //   });
      // }

      res.end('{"songs":' + JSON.stringify(filteredSongs) + '}');
    } 
  });
}

function saveSong(song) {
  fs.readFile(songFilePath, function(err, data) {
    if (err) throw err;

    var songs = JSON.parse(data);

    //TODO error checking?

    song.date = dateTime();
    song.likes = 0;

    if (songs['songs']) {
      songsList = songs['songs'];
      songsList.push(song);
      fs.writeFile(songFilePath, JSON.stringify(songs), function(err) {
        if (err) throw err;
        console.log('song saved!');
      });
    }
  });
}
