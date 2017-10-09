var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var TermSchema = new Schema({
  id: String,
  name: String,
  start: Date,
  end: Date,
  active: Boolean,
  status: String,
  open: Boolean
});

module.exports = mongoose.model('Terms', TermSchema);
