function message(obj){
	var el = document.createElement('p');
	console.log(obj.message);
	el.innerHTML = '<b>' + (obj.message[0]) + ':</b> ' + (obj.message[1]);
	document.getElementById('chat').appendChild(el);
	document.getElementById('chat').scrollTop = 1000000;
};

function send(){
	var val = document.getElementById('textit').value;
	socket.emit('message',{ my: ['you',val]});
	message({ message: ['you', val] });
	document.getElementById('textit').value = "";
};

var socket = io.connect('http://localhost:8080/');

socket.on('message', function(obj){
	console.log(obj);
	if ('buffer' in obj){
		document.getElementById('form').style.display='block';
		document.getElementById('chat').innerHTML = '';

		for (var i in obj.buffer) 
			message(obj.buffer[i]);
	} else 
		message(obj);
});/*
socket.on('announcement', function(obj){
	alert("cheguei");		
});*/
