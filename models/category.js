var mongoose = require('../data/mongoose/mongoose');

var Schema = mongoose.Schema;


var categorySchema = new Schema({
	title: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	description: {
		type: String,
		required: [true, "Поле обязательно для заполнения"]
	},
	created_at: { 
		type: Date, 
		default: Date.now 
	}
});

var Category = mongoose.model('Category', categorySchema);


module.exports = Category;

// Get categories
module.exports.getCategories = function(callback, limit) {
	Category.find(callback).limit(limit).sort([["title", "ascending"]]);
}; 

// Get one category by id
module.exports.getCategoryById = function(id, callback) {
	Category.findById(id, callback);
};

// Add category
module.exports.addCategory = function(category, callback) {
	Category.create(category, callback);
};

// Update category
module.exports.updateCategory = function(query, update, options, callback) {
	Category.findOneAndUpdate(query, update, options, callback);
};

// Remove category
// не нужен, запрос делается прямо из router