var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var CourseSchema = new Schema({
	fullName: {type: String, required: true, unique : true, dropDups: true},
    name: {type: String, required: true},
	title: String,
	subject: {type: String, required: true},
	number: {type: Number, required: true},
	section: {type: String, required: true},
	course_id: {type: Number, required: true},
	semester: {type: String, required: true}
});

module.exports = mongoose.model('Course', CourseSchema);