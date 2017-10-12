var express = require('express');
var router = express.Router();

var Category = require("../models/category");
var Article = require("../models/article");


/* GET blog page. /blog */
router.get('/', function(req, res, next) {
	Article.getArticles(function(err, results) { // сам метод getArticles(query, callback, limit) принимает у нас три параметра, но мы можем передавать только те которые нам нужны, и например если мы не передадим query, это значит что у нас будет пустой объект в запросе Article.find({}, callback).limit(limit); - что значит найти все варианты, тоже и с limit, а нужно нам это потому что метод .find() в mongo универсальный, например можно найти всё, как сдесь, или если передать параметры поиска, то будет искать что-то конкретное, исходя из параметров, как в /blog/articles/categories/:category_id чуть ниже, там мы передаём парамтр поиска по категории равной определённому id  
		if (err) {
			res.send(err);
		} else {
			res.render('blog', {
				articles: results
			});
		}
	});
});

// /blog/articles
router.get('/articles', function(req, res, next) {
	Article.getArticles(function(err, results) {
		if (err) {
			res.send(err);
		} else {
			res.render('articles', {
				title: "All Articles",
				articles: results
			});
		}
	});
});

// /blog/articles/article/id
router.get('/articles/article/:id', function(req, res, next) {
	Article.getArticleById([req.params.id], function(err, article) {
		if (err) {
			res.send(err);
		} else {
			res.render('article', {
				article: article
			});
		}
	});
});

// /blog/categories
router.get('/categories', function(req, res, next) {
	Category.getCategories(function(err, results) { // метод getCategories() в model
		if (err) {
			res.send(err);
		} else {
			res.render('categories', {
				title: "Categories",
				categories: results
			});
		}
	});
});

// /blog/articles/categories/:category_id // это когда мы на странице с категориями и выбираем какую-то категорию, соответственно переходим на какую-то страницу, в зависимости от выбранной категории
router.get('/articles/category/:category_id', function(req, res, next) {
	// console.log("req.params.category_id: ", req.params.category_id);
	Article.getArticles({category: req.params.category_id}, function(err, articles) { // запрашиваем все статьи с выбранной категорией
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			Category.getCategoryById(req.params.category_id, function(err, category) { // если всё норм, то запрашиваем именно эту категорию по которой кликнули, правда я не очень понял зачем? чтобы заголовок категории вытащить что-ли для render({"title": category.title}) ? или для чего? вроде да, тупо для заголовка делаем запрос в базу =)
				if (err) {
					res.send(err);
				} else {
					res.render('articles', { 
						"title": category.title + " " + "Articles", // ну вот просто для форматирования сделали так что бы было например "Football Articles", можно и просто передать category.title , тогда будет просто "Football"
						"articles": articles
					});
				}
			});
		}
	});
});

// /blog/manage/articles
router.get('/manage/articles', function(req, res, next) {
	Article.getArticles(function(err, results) {
		if (err) {
			res.send(err);
		} else {
			res.render('manage_articles', {
				title: "Manage Articles",
				articles: results
			});
		}
	});
});

// /blog/manage/categories
router.get('/manage/categories', function(req, res, next) {
	Category.getCategories(function(err, results) { // метод getCategories() в model
		if (err) {
			res.send(err);
		} else {
			res.render('manage_categories', {
				title: "Manage Categories",
				categories: results
			});
		}
	});
});

// /blog/manage/articles/add
router.get('/manage/articles/add', function(req, res, next) {
	Category.getCategories(function(err, categories) {
		res.render('add_article', {
			title: "Add Article",
			categories: categories
		});
	});
});

// POST 
router.post('/manage/articles/add', function(req, res, next) {
	// expressValidator
	// console.log(req.body);
	req.checkBody("title", "Title is required").notEmpty(); // проверяем что полу не пустое
	req.checkBody("subtitle", "Subtitle is required").notEmpty(); 
	req.checkBody("category", "Category is required").notEmpty();
	req.checkBody("author", "Author is required").notEmpty();
	req.checkBody("body", "Body is required").notEmpty();
	var errors = req.validationErrors(); // проверка на наличие ошибок

	if (errors) {
		console.log("errors: ", errors);
		Category.getCategories(function(err, categories) { // если у нас есть не заполненные поля, то страничка перерендерится и покажутся не заполненные поля, но так как страница перерендерится, то у нас пропадёт выбор категорий, так как он происходит у нас по другому url "/manage/articles/add", а нам нужно показать что поля не заполнены и что бы пользователь дальше смог заполнить недостающие поля, поэтому нам снова понадобится сделать запрос в базу за категориями
			if (err) {
				res.send(err);
			} else {
				res.render("add_article", {
					title: "Add Article",
					errors: errors,
					categories: categories
				});
			}
		});
	} else {
		var article = new Article(); // создаём новый экземпляр схемы
		article.title = req.body.title; // пишем данные
		article.subtitle = req.body.subtitle;
		article.category = req.body.category;
		article.author = req.body.author;
		article.body = req.body.body;

		Article.addArticle(article, function(err, article) { // сохраняем, сам метод в model
			if (err) {
				res.send(err);
			} else {
				req.flash("success", "Article Saved"); // в manage_categories.pug отобразится это сообщение в != messages()
				res.redirect("/blog/manage/articles");
			}
		});
	}
});

// /blog/manage/categories/add // когда get то показываем страницу с формой добавления
router.get('/manage/categories/add', function(req, res, next) {
	res.render('add_category', {title: "Add Category"});
});

// когда post, то это обрабатываем отпраку нам данных через форму
router.post('/manage/categories/add', function(req, res, next) {
	// expressValidator
	// console.log(req.body);
	req.checkBody("title", "Title is required").notEmpty(); // проверяем что полу не пустое
	req.checkBody("description", "Description is required").notEmpty();
	var errors = req.validationErrors(); // проверка на наличие ошибок

	if (errors) {
		console.log("errors: ", errors);
		res.render("add_category", {
			title: "Add Category",
			errors: errors
		});
	} else {
		var category = new Category(); // создаём новый экземпляр схемы
		category.title = req.body.title; // пишем данные
		category.description = req.body.description;

		Category.addCategory(category, function(err, category) { // сохраняем, сам метод в model
			if (err) {
				res.send(err);
			} else {
				req.flash("success", "Category Saved"); // в manage_categories.pug отобразится это сообщение в != messages()
				res.redirect("/blog/manage/categories");
			}
		});
	}
});

// /blog/manage/articles/edit
router.get('/manage/articles/edit/:id', function(req, res, next) {
	Article.getArticleById([req.params.id], function(err, article) {
		if (err) {
			res.send(err);
		} else {
			Category.getCategories(function(err, categories) {
				if (err) {
					res.send(err);
				} else {
					// console.log("article ", article); // отлаживал вывод выбранной категории статьи по-умолчанию, в options selected, см. файл edit_article.pug
					// console.log("categories ", categories); // при выборе редактирования статьи, должно автоматом подставляться правильная категория, оказалось что была проблема в том, что приходят разные по типу значения: число в category._id и строка в article.category, решил проблему приведя всё к строкам
					res.render('edit_article', {
						title: "Edit Article",
						article: article,
						categories: categories
					});
				}
			});
		}
	});
});

// POST==================
router.post('/manage/article/edit/:id', function(req, res, next) {
	// expressValidator
	// console.log(req.body);
	req.checkBody("title", "Title is required").notEmpty(); // проверяем что полу не пустое
	req.checkBody("subtitle", "Subtitle is required").notEmpty(); 
	req.checkBody("category", "Category is required").notEmpty();
	req.checkBody("author", "Author is required").notEmpty();
	req.checkBody("body", "Body is required").notEmpty();
	var errors = req.validationErrors(); // проверка на наличие ошибок

	if (errors) {
		console.log("errors: ", errors);
		Article.getArticleById([req.params.id], function(err, article) {
			if (err) {
				res.send(err);
			} else {
				Category.getCategories(function(err, categories) { // если у нас есть не заполненные поля, то страничка перерендерится и покажутся не заполненные поля, но так как страница перерендерится, то у нас пропадёт выбор категорий, так как он происходит у нас по другому url "/manage/articles/add", а нам нужно показать что поля не заполнены и что бы пользователь дальше смог заполнить недостающие поля, поэтому нам снова понадобится сделать запрос в базу за категориями
					if (err) {
						res.send(err);
					} else {
						res.render("edit_article", {
							title: "Edit Article",
							errors: errors,
							article: article,
							categories: categories
						});
					}
				});
			}
		});
	} else {
		var article = new Article();
		var query = {_id: [req.params.id]};
		var update = {title: req.body.title, subtitle: req.body.subtitle, category: req.body.category, author: req.body.author, body: req.body.body};

		Article.updateArticle(query, update, {}, function(err, category) { // сохраняем, сам метод в model
			if (err) {
				res.send(err);
			} else {
				req.flash("success", "Articles Updated"); // в manage_categories.pug отобразится это сообщение в != messages()
				res.redirect("/blog/manage/articles");
			}
		});
	}
});

// /blog/manage/categories/edit, показывает страничку редактирования
router.get('/manage/categories/edit/:id', function(req, res, next) {
	Category.getCategoryById([req.params.id], function(err, category) {
		if (err) {
			res.send(err);
		} else {
			res.render('edit_category', {
				title: "Edit Category",
				category: category
			});
		}
	});
});

// /blog/manage/category/edit, сохраняем изменения после редактирования
router.post('/manage/category/edit/:id', function(req, res, next) {
	// expressValidator
	// console.log(req.body);
	req.checkBody("title", "Title is required").notEmpty(); // проверяем что полу не пустое
	req.checkBody("description", "Description is required").notEmpty();
	var errors = req.validationErrors(); // проверка на наличие ошибок

	if (errors) {
		console.log("errors: ", errors);
		Category.getCategoryById([req.params.id], function(err, category) {
			if (err) {
				res.send(err);
			} else {
				res.render('edit_category', {
					title: "Edit Category",
					category: category,
					errors: errors
				});
			}
		});
	} else {
		var category = new Category(); // создаём новый экземпляр схемы
		var query = {_id: [req.params.id]};
		var update = {title: req.body.title, description: req.body.description};


		Category.updateCategory(query, update, {}, function(err, category) { // сохраняем, сам метод в model
			if (err) {
				res.send(err);
			} else {
				req.flash("success", "Category Updated"); // в manage_categories.pug отобразится это сообщение в != messages()
				res.redirect("/blog/manage/categories");
			}
		});
	}
});

// /blog/manage/article/delete
router.delete("/manage/article/delete/:id", function(req, res, next) {
	// console.log("req.params.id ", req.params.id);
	var query = {_id: [req.params.id]};
	// console.log("query ", query);
	Article.remove(query, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.status(204).send(); // тут просто можно например отправить статус и пустой send(), что бы закрыть соединение, потому что у нас в ajax-запросе обрабатывается что нужно сделать в успешном случае, а именно там у нас редирект на "/blog/manage/categories"
		}
	});
});

// /blog/manage/category/delete
router.delete("/manage/category/delete/:id", function(req, res, next) {
	// console.log("req.params.id ", req.params.id);
	var query = {_id: [req.params.id]};
	// console.log("query ", query);
	Category.remove(query, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.status(204).send(); // тут просто можно например отправить статус и пустой send(), что бы закрыть соединение, потому что у нас в ajax-запросе обрабатывается что нужно сделать в успешном случае, а именно там у нас редирект на "/blog/manage/categories"
		}
	});
});

// /articles/comments/add/:id
router.post("/articles/comments/add/:id", function(req, res, next) {
	// validation
	req.checkBody("comment_subject", "Subject field is required").notEmpty();
	req.checkBody("comment_author", "Author field is required").notEmpty();
	req.checkBody("comment_email", "Email field is required").notEmpty();
	req.checkBody("comment_body", "Body field is required").notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		Article.getArticleById([req.params.id], function(err, article) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.render("article", {
					"article": article,
					"errors": errors
				});
			}
		});
	} else {
		var article = new Article();
		var query = {_id: [req.params.id]};

		var comment = {
			"comment_subject": req.body.comment_subject,
			"comment_author": req.body.comment_author,
			"comment_email": req.body.comment_email,
			"comment_body": req.body.comment_body,
		}
		Article.addComment(query, comment, function(err, result) {
			if (err) {
				res.send(err);
			} else {
				res.redirect("/blog/articles/article/" + req.params.id);
			}
		});
	}
});

// /blog/contact
router.get("/contact", function(req, res, next) {
	res.render("contact", {
		title: "Contact Me"
	});
});

module.exports = router;