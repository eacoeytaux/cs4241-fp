var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , dateTime = require('date-time')
  , port = 8080;

var songFilePath = 'songs.json'

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url);

  if (req.method == 'POST') {
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
      console.log('POST data', body);
      switch (req.url) {
        case '/add-song':
          saveSong(JSON.parse(body));
          break;
        case '/update-rating':
          updateSongRating(JSON.parse(body));
          break;
        default:
          console.log('handling unknown post request', req.url);
      }
    });
  } else if (req.method == 'GET') {
    console.log(uri.pathname);
    switch (uri.pathname) {
      case '/check-song':
        checkSongs(res, uri);
        break;
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
        var found = false;
        for (var i in instruments) {
          if (instruments[i] == uri.pathname) {
            found = true;
            console.log('sending ' + uri.pathname);
            sendFile(res, 'public' + uri.pathname);
          }
        }
        if (!found) {
          console.log('could not find \'' + uri.pathname + '\'');
          res.end('404 not found');
        }
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

function checkSongs(res, uri) {
  res.writeHead(200, {'Content-type': 'application/json'});

  fs.readFile(songFilePath, function(err, data) {
    if (err) throw err;

    var titleArtist = uri.query.split(":");

    var songs = JSON.parse(data);
    if (songs['songs']) {
      songsList = songs['songs'];

      for (var song in songsList) {
        if ((songsList[song].name.toLowerCase() == titleArtist[0].toLowerCase()) && (songsList[song].artist.toLowerCase() == titleArtist[1].toLowerCase())) {
          res.end(false);
        }
      }
      res.end(true);
    } else {
      res.end(true);
    }
  });
}

function searchSongs(res, uri) {
  res.writeHead(200, {'Content-type': 'application/json'});

  uri.query = uri.query.replace('%20', ' ');

  fs.readFile(songFilePath, function(err, data) {
    if (err) throw err;

    var songs = JSON.parse(data);
    if (songs['songs']) {
      songsList = songs['songs'];

      filteredSongs = [];

      for (var song in songsList) {
        if (uri.pathname == '/search-song') {
          if (songsList[song]['name'].toLowerCase().indexOf(uri.query.toLowerCase()) > -1) {
            filteredSongs.push(songsList[song])
          }
        } else if (uri.pathname == '/search-artist') {
          if (songsList[song]['artist'].toLowerCase().indexOf(uri.query.toLowerCase()) > -1) {
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

function updateSongRating(updateInfo) {
  fs.readFile(songFilePath, function(err, data) {
    if (err) throw err;

    var songs = JSON.parse(data);

    if (songs['songs']) {
      for (var song in songs['songs']) {
        if ((songs['songs'][song].name == updateInfo.name) && (songs['songs'][song].artist == updateInfo.artist)) {
          console.log('found song!');
          songs['songs'][song].likes = updateInfo.likes;
        }
      }

      fs.writeFile(songFilePath, JSON.stringify(songs), function(err) {
        if (err) throw err;
        console.log('song updated!');
      })
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

var instruments = [
  "/soundfont/accordion-ogg.js",
  "/soundfont/acoustic_bass-ogg.js",
  "/soundfont/acoustic_grand_piano-ogg.js",
  "/soundfont/acoustic_guitar_nylon-ogg.js",
  "/soundfont/acoustic_guitar_steel-ogg.js",
  "/soundfont/agogo-ogg.js",
  "/soundfont/alto_sax-ogg.js",
  "/soundfont/applause-ogg.js",
  "/soundfont/banjo-ogg.js",
  "/soundfont/baritone_sax-ogg.js",
  "/soundfont/bassoon-ogg.js",
  "/soundfont/bird_tweet-ogg.js",
  "/soundfont/blown_bottle-ogg.js",
  "/soundfont/brass_section-ogg.js",
  "/soundfont/breath_noise-ogg.js",
  "/soundfont/bright_acoustic_piano-ogg.js",
  "/soundfont/celesta-ogg.js",
  "/soundfont/cello-ogg.js",
  "/soundfont/choir_aahs-ogg.js",
  "/soundfont/church_organ-ogg.js",
  "/soundfont/clarinet-ogg.js",
  "/soundfont/contrabass-ogg.js",
  "/soundfont/distortion_guitar-ogg.js",
  "/soundfont/drawbar_organ-ogg.js",
  "/soundfont/dulcimer-ogg.js",
  "/soundfont/electric_bass_finger-ogg.js",
  "/soundfont/electric_bass_pick-ogg.js",
  "/soundfont/electric_grand_piano-ogg.js",
  "/soundfont/electric_guitar_clean-ogg.js",
  "/soundfont/electric_guitar_jazz-ogg.js",
  "/soundfont/electric_guitar_muted-ogg.js",
  "/soundfont/electric_piano_1-ogg.js",
  "/soundfont/electric_piano_2-ogg.js",
  "/soundfont/english_horn-ogg.js",
  "/soundfont/fiddle-ogg.js",
  "/soundfont/flute-ogg.js",
  "/soundfont/french_horn-ogg.js",
  "/soundfont/fretless_bass-ogg.js",
  "/soundfont/fx_1_rain-ogg.js",
  "/soundfont/fx_2_soundtrack-ogg.js",
  "/soundfont/fx_3_crystal-ogg.js",
  "/soundfont/fx_4_atmosphere-ogg.js",
  "/soundfont/fx_5_brightness-ogg.js",
  "/soundfont/fx_6_goblins-ogg.js",
  "/soundfont/fx_7_echoes-ogg.js",
  "/soundfont/fx_8_scifi-ogg.js",
  "/soundfont/glockenspiel-ogg.js",
  "/soundfont/guitar_fret_noise-ogg.js",
  "/soundfont/guitar_harmonics-ogg.js",
  "/soundfont/gunshot-ogg.js",
  "/soundfont/harmonica-ogg.js",
  "/soundfont/harpsichord-ogg.js",
  "/soundfont/helicopter-ogg.js",
  "/soundfont/honkytonk_piano-ogg.js",
  "/soundfont/kalimba-ogg.js",
  "/soundfont/koto-ogg.js",
  "/soundfont/lead_1_square-ogg.js",
  "/soundfont/lead_2_sawtooth-ogg.js",
  "/soundfont/lead_3_calliope-ogg.js",
  "/soundfont/lead_4_chiff-ogg.js",
  "/soundfont/lead_5_charang-ogg.js",
  "/soundfont/lead_6_voice-ogg.js",
  "/soundfont/lead_7_fifths-ogg.js",
  "/soundfont/lead_8_bass_lead-ogg.js",
  "/soundfont/marimba-ogg.js",
  "/soundfont/melodic_tom-ogg.js",
  "/soundfont/music_box-ogg.js",
  "/soundfont/muted_trumpet-ogg.js",
  "/soundfont/oboe-ogg.js",
  "/soundfont/ocarina-ogg.js",
  "/soundfont/orchestra_hit-ogg.js",
  "/soundfont/orchestral_harp-ogg.js",
  "/soundfont/overdriven_guitar-ogg.js",
  "/soundfont/pad_1_new_age-ogg.js",
  "/soundfont/pad_2_warm-ogg.js",
  "/soundfont/pad_3_polysynth-ogg.js",
  "/soundfont/pad_4_choir-ogg.js",
  "/soundfont/pad_5_bowed-ogg.js",
  "/soundfont/pad_6_metallic-ogg.js",
  "/soundfont/pad_7_halo-ogg.js",
  "/soundfont/pad_8_sweep-ogg.js",
  "/soundfont/pan_flute-ogg.js",
  "/soundfont/percussive_organ-ogg.js",
  "/soundfont/piccolo-ogg.js",
  "/soundfont/pizzicato_strings-ogg.js",
  "/soundfont/recorder-ogg.js",
  "/soundfont/reed_organ-ogg.js",
  "/soundfont/reverse_cymbal-ogg.js",
  "/soundfont/rock_organ-ogg.js",
  "/soundfont/seashore-ogg.js",
  "/soundfont/shakuhachi-ogg.js",
  "/soundfont/shamisen-ogg.js",
  "/soundfont/shanai-ogg.js",
  "/soundfont/sitar-ogg.js",
  "/soundfont/slap_bass_1-ogg.js",
  "/soundfont/slap_bass_2-ogg.js",
  "/soundfont/soprano_sax-ogg.js",
  "/soundfont/steel_drums-ogg.js",
  "/soundfont/string_ensemble_1-ogg.js",
  "/soundfont/string_ensemble_2-ogg.js",
  "/soundfont/synth_bass_1-ogg.js",
  "/soundfont/synth_bass_2-ogg.js",
  "/soundfont/synth_drum-ogg.js",
  "/soundfont/synth_voice-ogg.js",
  "/soundfont/synthbrass_1-ogg.js",
  "/soundfont/synthbrass_2-ogg.js",
  "/soundfont/synthstrings_1-ogg.js",
  "/soundfont/synthstrings_2-ogg.js",
  "/soundfont/taiko_drum-ogg.js",
  "/soundfont/tango_accordion-ogg.js",
  "/soundfont/telephone_ring-ogg.js",
  "/soundfont/tenor_sax-ogg.js",
  "/soundfont/timpani-ogg.js",
  "/soundfont/tinkle_bell-ogg.js",
  "/soundfont/tremolo_strings-ogg.js",
  "/soundfont/trombone-ogg.js",
  "/soundfont/trumpet-ogg.js",
  "/soundfont/tuba-ogg.js",
  "/soundfont/tubular_bells-ogg.js",
  "/soundfont/vibraphone-ogg.js",
  "/soundfont/viola-ogg.js",
  "/soundfont/violin-ogg.js",
  "/soundfont/voice_oohs-ogg.js",
  "/soundfont/whistle-ogg.js",
  "/soundfont/woodblock-ogg.js",
  "/soundfont/xylophone-ogg.js"
]
