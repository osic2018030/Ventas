'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pcartSchema = Schema({
    product:{type:Schema.Types.ObjectId, ref: 'product'},
    amount:Number
});

module.exports = mongoose.model('productCart', pcartSchema);