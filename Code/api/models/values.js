/**
 * This schema is for any arbitrary configuration and or values that need to be stored in the database but don't
 * "deserve" to have a table of it's own for any reason. Note there is no restriction on the type of the value. Note
 * the information of this collection will be exposed through the api for EVERYONE to see so nothing sensitive should be
 * put here.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ValuesSchema = new Schema({
    key: {type: String, required: true, index: {unique:true}},
    value: {type: Schema.Types.Mixed, required: true},
});

module.exports = mongoose.model('Values', ValuesSchema);