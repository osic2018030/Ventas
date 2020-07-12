'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = Schema({
    CU:String,
    products:[{
        product:{type:Schema.Types.ObjectId, ref: 'product'},
        amount:Number
    }], 
    saleTotal:Number,
    status:String
});

module.exports = mongoose.model('cart', cartSchema);