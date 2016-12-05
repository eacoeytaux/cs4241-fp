var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080;

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
      break
    case '/index.html':
      sendFile(res, 'public/index.html')
      break
    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break
    case '/images/color-wheel.png':
      sendFile(res, 'public/images/color-wheel.png');
      break;
    case '/images/eye.png':
      sendFile(res, 'public/images/eye.png', 'image/png');
      break;
    case '/images/eye-red.png':
      sendFile(res, 'public/images/eye-red.png', 'image/png');
      break;
    case '/images/wall.jpg':
      sendFile(res, 'public/images/wall.jpg', 'image/jpg')
      break
    case '/images/door.jpg':
      sendFile(res, 'public/images/door.jpg', 'image/jpg')
      break
    case '/images/skeleton.gif':
      sendFile(res, 'public/images/skeleton.gif', 'image/gif')
      break
    case '/images/ghost.png':
      sendFile(res, 'public/images/ghost.png', 'image/png')
      break
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break
    case 'README.md':
    case '/README':
      sendFile(res, 'README.md')
      break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}
