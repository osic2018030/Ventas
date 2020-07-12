'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var categoryRoutes = require('./routes/category.route');
var productRoutes = require('./routes/product.route');
var userRoutes = require('./routes/user.route');
var cartRoutes = require('./routes/cart.route');
var billRoutes = require('./routes/bill.route');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use(billRoutes);
app.use(cartRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
module.exports = app;