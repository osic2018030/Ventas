'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    CP:String,
    name:String,
    description:String,
    price:Number,
    stock:Number,
    category:{ type: Schema.Types.ObjectId, ref: 'category'},
    bought:Number
});

module.exports = mongoose.model('product', productSchema);
