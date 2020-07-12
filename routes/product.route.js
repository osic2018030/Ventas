'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveProduct',mdAuth.ensureAuthAdmin,productController.saveProduct);
api.put('/updateProduct/:id',mdAuth.ensureAuthAdmin, productController.updateProduct);
api.delete('/removeProduct/:id',mdAuth.ensureAuthAdmin, productController.removeProduct);
api.get('/listProducts',mdAuth.ensureAuth, productController.listProducts);
api.post('/searchProduct',mdAuth.ensureAuth,productController.searchProducts);
api.get('/searchBestSeal',mdAuth.ensureAuth, productController.searhProductBestSale);
api.get('/searchSoldOut',mdAuth.ensureAuthAdmin, productController.searhProductSoldout);

module.exports = api;