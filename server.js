var fs = require('fs'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    url = require('url'),
    http = require('http'),
    path = require('path'),
    mime = require('mime');

server = http.createServer(function(req, res){
    var serverPath = url.parse(req.url).pathname;
    var filename = __dirname + serverPath;
    switch (serverPath){
    case '/':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h1>LI7E</h1><ul><li><a href="client.html">Test Processing.JS</a></li><li><a href="test_li7elang.html">Test LI7E Lang</a></li><li><a href="docs/li7e.html">Documentation</a></li></ul>');
        res.end();
        break;
      
    default:
        // serv all static files
        path.exists(filename, function(exists) {
            if (!exists) {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("404 Not Found");
                res.end();
                return;
            }

            res.writeHead(200, {'Content-Type': mime.lookup(filename)});
            fs.createReadStream(filename, {
                'flags': 'r',
                'encoding': 'binary',
                'mode': 0666,
                'bufferSize': 4 * 1024
            }).addListener("data", function(chunk) {
                res.write(chunk, 'binary');
            }).addListener("close",function() {
                res.end();
            });
        });
        break;
    }
});

server.listen(8080);

var io = require('socket.io').listen(server), 
	tileObjs = [];

io.sockets.on('connection', function(client){
    client.broadcast.emit({ connection: client.sessionId});
    client.on('message', function(message){
        var msg = { message: [client.sessionId, message] };
        console.log(msg);
        tileObjs.push(msg);
        client.broadcast(msg);
    });
    client.on('disconnect', function(){
        client.broadcast({ disconnection: client.sessionId});
    });
});	
