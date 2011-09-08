var app = require('express').createServer()
	, io = require('socket.io').listen(app)
	, express = require('express');

app.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/src/squars/squars.html');
});

//app.use("/style", express.static(__dirname + '/style'));
//app.use("/js", express.static(__dirname + '/js'));	
app.use(express.static(__dirname + '/src/squars'));
app.use('/vendor',express.static(__dirname + '/vendor'));
app.use('/vendor/Audiolet/src/audiolet', express.static(__dirname + '/vendor/Audiolet/src/audiolet'));
app.use('/vendor/Audiolet/src/mootools', express.static(__dirname + '/vendor/Audiolet/src/mootools'));
app.use('/vendor/jquery-ui-themes/ui-darkness', express.static(__dirname + '/vendor/jquery-ui-themes/ui-darkness'));


var buffer = [];

io.sockets.on('connection', function(client){

    client.send({ buffer: buffer });

    client.on('message', function(msg){
	console.log(msg.my[1]);
	buffer.push(msg.my[1]);
        if (buffer.length > 15) buffer.shift();
	client.broadcast.emit('message', {message:[msg.my[0], msg.my[1]]} );
    });

    client.on('disconnect', function(){
        client.broadcast.emit('announcement', 'disconected' );
    });
});

