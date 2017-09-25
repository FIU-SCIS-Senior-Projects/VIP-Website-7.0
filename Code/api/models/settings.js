/**
 * Created by Dafna on 6/17/17.
 */

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var SettingsSchema = new Schema({
    owner: {type: String, unique: true, required:true},
    current_email: String,
    emails: [String],
    emailSignature: String
});

module.exports = mongoose.model('Settings', SettingsSchema);