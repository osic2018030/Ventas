'use strict'

var Cart = require('../models/cart.model');
var pCart = require('../models/productCart.model');
var Product = require('../models/product.model');

function addProduct(req, res){
    let params = req.body;
    var cart = new  Cart();
    var pcart = new pCart();

    if(params.product && params.amount){
        Cart.findOne({status:'ON', CU:req.user.sub}, (err, cartFind)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(cartFind){
                pcart.product = params.product;
                pcart.amount =  params.amount;
                Product.findOne({_id:params.product, stock:{$gte:params.amount}}, (err, productFind)=>{
                    if(err){
                        res.status(500).send({message:'Error en el servidor'});
                    }else if(productFind){
                        var sale = parseInt(productFind.price) * parseInt(params.amount);
                        var tototal = parseInt(cartFind.saleTotal)+sale;
                        Cart.findOneAndUpdate({_id:cartFind.id}, {saleTotal:tototal,$push:{products:pcart}}, {new:true}).populate({path:'products.product',  select: { name:1}}).exec(function(err, productInCart){
                            if(err){
                                res.status(500).send({message:'Error en el servidor'});
                            }else if(productInCart){
                                Product.findOne({_id:params.product}, (err, productFindd)=>{
                                    if(err){
                                        res.status(500).send({message:'Error'});
                                    }else if(productFindd){
                                        var stockC = parseInt(productFindd.stock)-parseInt(params.amount);
                                        Product.findOneAndUpdate({_id:params.product},{stock:stockC,bought:params.amount},{new:true}, (err, productUpdated2)=>{
                                            if(err){
                                                res.status(500).send({message:'Error'});
                                            }else if(productUpdated2){
                                                res.send({productInCart:productInCart});
                                            }else{
                                                res.status(418).send({message:'No se pudo actualizar el producto'});
                                            }
                                        })
                                    }else{
                                        res.status(418).send({message:'No se encontro'})
                                    }
                                });
                            }else{
                                res.status(418).send({message:'No se pudo agregar al carrito'});
                            }
                        });
                    }else{
                        res.status(418).send({message:'No se puede sobrepasar el stock'});
                    }
                });
            }else{
                cart.status = 'ON';
                cart.saleTotal = 0;
                cart.CU = req.user.sub;
                cart.save((err, cartSaved)=>{
                    if(err){
                        res.status(500).send({message:'Error en el servidor'});
                    }else if(cartSaved){
                        pcart.product = params.product;
                        pcart.amount =  params.amount;
                        Product.findOne({_id:params.product,stock:{$gte:params.amount}}, (err, productFind)=>{
                            if(err){
                                res.status(500).send({message:'Error en el servidor'});
                            }else if(productFind){
                                var sale = parseInt(productFind.price) * parseInt(params.amount);
                                var tototal = parseInt(cartSaved.saleTotal)+sale;
                                Cart.findOneAndUpdate({_id:cartSaved.id}, {saleTotal:tototal,$push:{products:pcart}}, {new:true}).populate({path:'products.product',  select: { name:1}}).exec(function(err, productInCart){
                                    if(err){
                                        res.status(500).send({message:'Error en el servidor'});
                                    }else if(productInCart){
                                        Product.findOne({_id:params.product}, (err, productFindd)=>{
                                            if(err){
                                                res.status(500).send({message:'Error'});
                                            }else if(productFindd){
                                                var stockC = parseInt(productFindd.stock)-parseInt(params.amount);
                                                Product.findOneAndUpdate({_id:params.product},{stock:stockC,bought:params.amount},{new:true}, (err, productUpdated2)=>{
                                                    if(err){
                                                        res.status(500).send({message:'Error'});
                                                    }else if(productUpdated2){
                                                        res.send({productInCart:productInCart});
                                                    }else{
                                                        res.status(418).send({message:'No se pudo actualizar el producto'});
                                                    }
                                                })
                                            }else{
                                                res.status(418).send({message:'No se encontro'})
                                            }
                                        });
                                        
                                    }else{
                                        res.status(418).send({message:'No se pudo agregar al carrito'});
                                    }
                                });
                            }else{
                                res.status(418).send({message:'La cantidad sobrepasa el stock'});
                            }
                        });
                    }else{
                        res.status(418).send({message:'No se pudo crear el carrito'});
                    }
                });
            }
        });

    }else{
        res.send({message:'Ingrese los campos requeridos'});
    }

}


module.exports = {
    addProduct
}