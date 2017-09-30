const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('HelloExpress.db');


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


app.listen(3000, () => {
	console.log("Server start");
});