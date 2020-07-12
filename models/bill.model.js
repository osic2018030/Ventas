'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = Schema({
    name:String,
    fecha:String,
    cart:{type: Schema.Types.ObjectId, ref: 'cart'}
});

module.exports = mongoose.model('bill', billSchema);