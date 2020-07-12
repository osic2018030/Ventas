'use strict'

var express = require('express');
var categoryController = require('../controllers/category.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveCategory', mdAuth.ensureAuthAdmin,categoryController.saveCategory);
api.put('/updateCategory/:id', mdAuth.ensureAuthAdmin, categoryController.updateCategory);
api.delete('/removeCategory/:id', mdAuth.ensureAuthAdmin, categoryController.removeCategory);
api.get('/listCategories', mdAuth.ensureAuthAdmin, categoryController.listCategories);
module.exports = api;