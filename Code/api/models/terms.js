var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var TermSchema = new Schema({
    id: String,
    name: String,
    year: Number,
    start: Date,
    end: Date,
    active: Boolean,
	status: String
});

module.exports = mongoose.model('Terms', TermSchema);