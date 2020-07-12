'use strict'
var User = require('../models/user.model');
var Bill = require('../models/bill.model');
var Cart = require('../models/cart.model');
var moment = require('moment');

function generateBill(req, res){
        let userId = req.params.id;
        let billParams = req.body;
        let bill = new Bill();

    if(billParams.name && billParams.cart){
        User.findOne({"bills.cart":billParams.cart}, (err, billFind)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(billFind){
                res.send({message:'Ya existe la factura'});
            }else{
                bill.name = billParams.name;
                bill.fecha = moment();
                bill.cart = billParams.cart;
                User.findOneAndUpdate({_id:userId}, {$push:{bills:bill}},{new:true},(err, billSaved)=>{
                    if(err){
                        res.status(500).send({message:'Error en el servidor'});
                    }else if(billSaved){
                        Cart.findOneAndUpdate({_id:billParams.cart},{status:'SOLD'},{new:true},(err, cartUpdate)=>{
                            if(err){
                                res.status(500).send({message:'Error en el servidor'});
                            }else if(cartUpdate){
                                res.send({billSaved:billSaved});
                            }else{
                                res.status(418).send({message:'Carrito no actualizado'});
                            }
                        });
                        res.send({billSaved:billSaved});
                    }else{
                        res.status(418).send({message:'Factura no creada'});
                    }
                })
            }
        })
    }else{
        res.status({message:'Ingrese los campos requeridos'});
    }
}

function listBills(req, res){
    User.find({}, (err, bills)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(bills){
            res.send({bills:bills});
        }else{
            res.status(404).send({message:'No hay facturas que mostrar'});
        }
    });
}
 function searchBill(req, res){
    let billId = req.params.id; 
    User.findOne({"bills._id":billId},(err, billFind)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(billFind){
            res.send({billFind:billFind});
        }else{
            res.status(404).send({message:'No hay facturas que mostrar'});
        }
    }).populate('bills.cart');
 }

module.exports = {
    generateBill,
    listBills,
    searchBill
}