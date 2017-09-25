var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImpersonationLogSchema = new Schema({
    adminEmail: {type: String, required: true, index: {unique:true}},
    impersonatedEmail: {type: String, required: true},
    "connect.sid": {type: String, required: true, index: {unique:true}},
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ImpersonationLog', ImpersonationLogSchema);