var express = require('express');
var router = express.Router();

var db = require('../data/sqlite/sqlite');

// получить весь список
router.get("/", (req, res, next) => {
	db.all("SELECT * FROM TaskTodo", function(err, tasks){
        // console.log("tasks " + tasks);
        res.render("todo", {
			title: "Todo App",
			tasks: tasks
		});
    });
});

// добавить
router.post("/", (req, res, next) => {
	// console.log(req.body);
	let title = req.body.title; 
	let describe = req.body.describe;

	db.run("INSERT INTO TaskTodo (Title, Describe) VALUES (?, ?)", [title, describe], (err) => { 
		if (err) {
			throw err;
		} else {
			res.redirect("/todo");			
		}
	});
});

//изменить выполнено/не выполнено
router.post("/done/:id", (req, res, next) => {
	// console.log(req.params.id);
	// console.log(req.body.checked);
	var id = req.params.id;
	var check = +req.body.checked; // приводим к числу, так как у нас в базе в поле Done хранится число 1 или 0, напомню вся эта хрень с конвертациями потому что sqlite не поддерживает булены в чистом виде, поэтому я использую 1 и 0 типа true и false
	// console.log(typeof check);
	var flag = 1; // кароче мы меняем флаг на противоположный, по умолчанию сделаем выбран
	if (check) { // и если у нас с клиента приходит значение 1(выбран)
		flag = 0; // то меняем его на противоположное(не выбран), это условие сработает только если с клиента пришло 1, если с клиента пришло 0, то flag у нас уже установлен на 1, теперь отправляем это значение в базу
	}

	db.run("UPDATE TaskTodo SET Done = ? WHERE id = ?", [flag, id], (err) => { 
		if (err) {
			throw err;
		} else {
			res.status(200).send();		
		}
	});
});

// редактировать задачу (показать окно редактирования)
router.get("/edit/:id", (req, res, next) => {
	// console.log(req.params.id);
	var id = req.params.id;
	db.all("SELECT * FROM TaskTodo WHERE id = ?", id, (err, result) => { 
		if (err) {
			throw err;
		} else {
			// console.log(result);
			res.send(result);
		}
	});
});

// редактировать задачу (сохранить изменения при нажатии на кнопку Save)
router.post("/edit/:id", (req, res, next) => {
	// console.log(req.params.id);
	var id = req.params.id;
	var title = req.body.title;
	var describe = req.body.describe;
	db.run("UPDATE TaskTodo SET Title = ?, Describe = ? WHERE id = ?", [title, describe, id], (err) => { 
		if (err) {
			throw err;
		} else {
			res.status(200).send();
		}
	});
});

// удалить
router.delete("/delete/:id", (req, res, next) => {
	// console.log(req.params.id);
	var id = req.params.id;

	db.run("DELETE FROM TaskTodo WHERE id = ?", id, (err) => { 
		if (err) {
			throw err;
		} else {
			res.status(204).send();		
		}
	});
});



module.exports = router;