var mongoose = require('../data/mongoose/mongoose');

var Schema = mongoose.Schema;


var articleSchema = new Schema({
	title: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	subtitle: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	category: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	author: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	body: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	comments: [
		{
			comment_subject: {
				type: String,
				required: [true, "Поле обязательно для заполнения"]
			},
			comment_body: {
				type: String,
				required: [true, "Поле обязательно для заполнения"]
			},
			comment_author: {
				type: String,
				required: [true, "Поле обязательно для заполнения"]
			},
			comment_enail: {
				type: String,
				required: [true, "Поле обязательно для заполнения"]
			}, 
			comment_date: {
				type: Date, 
				default: Date.now 
			}	 
		}
	],
	created_at: { 
		type: Date, 
		default: Date.now 
	}
});

var Article = mongoose.model('Article', articleSchema);


module.exports = Article;


// Get articles
module.exports.getArticles = function(query, callback, limit) {
	Article.find(query, callback).limit(limit).sort([["created_at", -1]]); // https://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js ,  http://www.itgo.me/a/x5017372792131480493/in-mongoose-how-do-i-sort-by-date-node-js
}; 

// Get one article by id
module.exports.getArticleById = function(id, callback) {
	Article.findById(id, callback);
};

// Add article
module.exports.addArticle = function(article, callback) {
	Article.create(article, callback);
};

// Update article
module.exports.updateArticle = function(query, update, options, callback) {
	Article.findOneAndUpdate(query, update, options, callback);
};

// Remove article
// не нужен, запрос делается прямо из router

// Add comment
module.exports.addComment = function(query, comment, callback) { // кароче $push это что типа спец. метода в mongo/mongoose, там есть куча других тпа $gt и они все начинаются с $, см.доку
	Article.update(query, //  если не понятно такое форматирование, то попробуй записать в одну строку, тут как и раньше идёт запрос, параметры и потом коллбэк
		{
			$push: {
				comments: comment
			}
		},
		callback
	);
};