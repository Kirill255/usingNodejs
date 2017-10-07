var express = require('express');
var router = express.Router();

const fs = require("fs");

/* GET quotes page. */
router.get('/', function(req, res, next) {
	fs.readFile("data/json/quotes.json", 'utf8', function(err, data) { 
		if (err) throw err;
		
		var result = JSON.parse(data).quotes; // у меня структура json файла такая просто, получаем сам массив с цитатами
		// console.log(result);
		res.render('quotes', { 
			title: 'Quotes',
			quotes: result
		});
	});
	
});

module.exports = router;