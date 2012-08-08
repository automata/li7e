var express = require('express'),
    sharejs = require('share').server,
    sharejs_client = require('share').client;
var app = express();

// attach the sharejs REST and Socket.io interfaces to the server
var options = {db: {type: 'none'}};
sharejs.attach(app, options);

// let's use ejs as template engine
app.engine('.html', require('ejs').__express);

// where are the views?
app.set('views', __dirname + '/views');

// we don't need to add '.html' while calling res.render()
app.set('view engine', 'html');

// log while in development
app.use(express.logger('dev'));

// setting up session
app.use(express.cookieParser('shhh it is a secret'));
app.use(express.session());

// static files
app.use("/static", express.static(__dirname + '/static'));

//
// routers
//

// show just the raw
app.get('/:doc_name', function(req, res){
  //res.render("preview", {doc_name: req.params.doc_name});
  sharejs_client.open(req.params.doc_name, 'text', 'http://127.0.0.1:3000/channel', function(error, doc) {
    res.send(doc.getText());
  });
});

// show the full editor
app.get('/:doc_name/edit', function (req, res) {
  // TODO: change to full -> edit
  res.render("edit", {doc_name: req.params.doc_name});
});

// just show the editor area /:doc_name/editor

app.get('/preview', function(req, res) {
  res.send(req.session.code);
});

app.get('/publish', function (req, res) {
  req.session.code = req.query.code;
  res.send(req.query.code);
});

app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');