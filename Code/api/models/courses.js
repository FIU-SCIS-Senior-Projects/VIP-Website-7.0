var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var CourseSchema = new Schema({
    name: {type: String, required: true},
	title: String,
	subject: {type: String, required: true},
	number: {type: Number, required: true},
	section: {type: String, required: true},
	semester: {type: String, required: true}
});

module.exports = mongoose.model('Course', CourseSchema);