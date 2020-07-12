'use strict'

var express = require('express');
var cartController = require('../controllers/cart.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/addProduct',mdAuth.ensureAuth, cartController.addProduct);

module.exports = api;