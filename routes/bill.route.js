'use strict'

var express = require('express');
var billController = require('../controllers/bill.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/generateBill/:id',mdAuth.ensureAuthAdmin, billController.generateBill);
api.post('/searchBill/:id',mdAuth.ensureAuthAdmin, billController.searchBill);
api.get('/listBills',mdAuth.ensureAuthAdmin, billController.listBills);

module.exports = api;