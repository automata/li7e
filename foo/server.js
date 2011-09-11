var  express = require('express'),
     app = express.createServer(),
     io = require('socket.io').listen(app);
     
app.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client.html');
});

app.use("/style", express.static(__dirname + '/style'));
app.use("/js", express.static(__dirname + '/js'));

io.sockets.on('connection', function(client){
    client.on('message', function(msg){
	console.log(msg.my[1]);
	client.broadcast.emit('message', {message:[msg.my[0], msg.my[1]]} );
    });

    client.on('disconnect', function(){
        client.broadcast.emit('announcement', 'disconected' );
    });
});

