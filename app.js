var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session');

const expressValidator = require('express-validator');


var index = require('./routes/index');
var users = require('./routes/users');
var quotes = require('./routes/quotes');
var about = require('./routes/about');
var mail = require('./routes/mail');
var todo = require('./routes/todo');

var blog = require('./routes/blog');
// так как у меня сдесь не отдельное приложение, а несколько разных примеров на разных url
// то я решил не делать отдельные роуты для articles, categories, manage, а засунуть всё что косается блога в роут blog
// var articles = require('./routes/articles');
// var categories = require('./routes/categories');
// var manage = require('./routes/manage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.moment = require('moment'); // делаем глобальную переменную moment, которая будет доступна по view, гуглить app.locals

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use express-session
app.use(session({
	secret: 'verysecretstring',
	resave: false,
	saveUninitialized: true
	// cookie: { secure: true } // хер знает почему, но если ставить опцию cookie, то флеш сообщения не выводятся!!! что за херня? кароче убрал эту опцию временно, что бы всё работало, в будущем естественно, когда мне нужны будут куки, нахер удалить есь функционал с флеш сообщениями(они всё ровно не очень =))
}));

// use connect-flash && express-messages
// смотреть доку, вроде как express-messages и connect-flash вместе как-то связаны, а также чтобы всё это работало нужно подключить express-session
app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// use express-validator, кароче в новой доке всё по другому, вот старая дока https://devhub.io/repos/theorm-express-validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.');
		var root = namespace.shift();
		var formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

app.use('/', index);
app.use('/users', users);
app.use('/quotes', quotes);
app.use('/about', about);
app.use('/mail', mail);
app.use('/todo', todo);
app.use('/blog', blog);
// я убрал эти use, коммент смотри выше в require
// app.use('/articles', articles); 
// app.use('/categories', categories);
// app.use('/manage', manage);

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
// сначало хотел это тоже прикрутить как-нибудь используя sqlite3 (прикрутил примерно похожую логику в /todo)
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


