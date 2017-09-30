var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('HelloExpress.db');

var index = require('./routes/index');
var users = require('./routes/users');
var quotes = require('./routes/quotes');
var about = require('./routes/about');
var mail = require('./routes/mail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/quotes', quotes);
app.use('/about', about);
app.use('/mail', mail);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




/*

// /
app.get("/", (req, res) => {
	console.log(req.method, req.url);
	res.send("main");
});

app.post("/", (req, res) => {
	console.log(req.method, req.url);
	res.send("main");
});

app.put("/", (req, res) => {
	console.log(req.method, req.url);
	res.send("main");
});

app.delete("/", (req, res) => {
	console.log(req.method, req.url);
	res.send("main");
});

// /about
app.get("/about", (req, res) => {
	console.log(req.method, req.url);
	res.send("about");
});

// /order
app.get("/order", (req, res) => {
	console.log(req.method, req.url);
	res.send("order");
});

// /quotes
app.get("/quotes", (req, res) => {
	console.log(req.method, req.url);
	db.all("SELECT * FROM Quotes", (err, result) => { // db.all is used to run a SQL SELECT statement and retrieve all resulting rows
		if (err) throw err;
		console.log("result ", result);
		res.send(result);
	});
});

app.get("/quotes/:author", (req, res) => {
	console.log(req.method, req.url);
	console.log(req.params);
	db.all("SELECT * FROM Quotes WHERE Author = ?", [req.params.author], (err, result) => { // The ? in the statement is a placeholder for the METHOD data we wish to insert. We fill this in with the req.params.author value // Maybe Author=?
		if (err) throw err;
		console.log("result ", result);
		res.send(result);
	});
});

app.post("/quotes/:author", (req, res) => {
	console.log(req.method, req.url);
	console.log(req.body);
	db.run("INSERT INTO Quotes VALUES ?", [req.body], (err, result) => { // This route uses the db.run method to run a SQL INSERT statement. You can use the db.run method to run any SQL statement other than the SELECT statement. (Use the db.all method for SQL SELECT statements like we did in the example above) // To perform SELECT query you should use .all function and for other operations such as DELETE, UPDATE, INSERT you should use .run function.  // The ? in the INSERT statement is a placeholder for the POST data we wish to insert. We fill this in with the request.body object, which contains the data that was sent with the request.
		if (err) throw err;
		console.log("result ", result);
		res.send(result);
	});
});



*/


