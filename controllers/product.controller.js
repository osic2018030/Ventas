'use strict'
var Product = require('../models/product.model');


function saveProduct(req, res){
    var product = new Product();
    var params = req.body;

    if(params.CP && params.name && params.description && params.price && 
        params.stock && params.category){
            Product.findOne({CP:params.CP}, (err, prodFind)=>{
                if(err){
                    res.status(500).send({message:'Error en el servidor'});
                }else if(prodFind){
                    res.send({message:'El producto con ese codigo ya existe'});
                }else{
                    product.CP = params.CP;
                    product.name = params.name;
                    product.description = params.description;
                    product.price = params.price;
                    product.stock = params.stock;
                    product.category = params.category;

                    product.save((err, productSaved)=>{
                        if(err){
                            res.status(500).send({message:'Error en el servidor'});
                        }else if(productSaved){
                            res.send({productSaved:productSaved});
                        }else{
                            res.status(418).send({message:'Producto no guardado'});
                        }
                    });
                }
            });
        }else{
            res.send({message:'Ingrese todos los campos necesarios'});
        }
}

function updateProduct(req, res){
    var prodId = req.params.id;
    var update = req.body;
    Product.findByIdAndUpdate(prodId, update, {new:true}, (err,  prodUpdate)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(prodUpdate){
            res.send({prodUpdate:prodUpdate});
        }else{
            res.status(418).send({message:'No se pudo actualizar el registro'});
        }
    });
}

function removeProduct(req, res){
    var prodId = req.params.id;
    Product.findByIdAndRemove(prodId, (err, prodRemove)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(prodRemove){
            res.send({message:'Producto Eliminado'});
        }else{
            res.status(418).send({message:'No se pudo eliminar el producto'});
        }
    })
}

function listProducts(req, res){
    Product.find({}, (err, products)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(products){
            res.send({products:products});
        }else{
            res.status(404).send({message:'No hay productos que mostrar'});
        }
    }).populate('category');
}


function searchProducts(req, res){
    var params = req.body;

    if(params.name){
        Product.findOne({name:params.name}, (err, productFind)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(productFind){
                res.send({productFind: productFind});
            }else{
                res.status(404).send({message:'No hay ninguna coincidencia'});
            }
        }).populate('category');
    }else if(params.category){
        Product.findOne({}, (err, productFind)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(productFind){
                res.send({productFind: productFind});
            }else{
                res.status(404).send({message:'No hay ninguna coincidencia'});
            }
        }).populate({path: 'category', match: {name: params.category}});
    }
}

function searhProductBestSale(req, res){
    Product.find({}, (err, products)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(products){
            res.send({products:products});
        }else{
            res.status(404).send({message:'No hay productos que mostrar'});
        }
    }).sort({bought:-1}).limit(5);
}

function searhProductSoldout(req, res){
    Product.find({stock:0}, (err, products)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(products){
            res.send({products:products});
        }else{
            res.status(404).send({message:'No hay productos que mostrar'});
        }
    });
}

module.exports = {
    saveProduct,
    updateProduct,
    removeProduct,
    listProducts,
    searchProducts,
    searhProductBestSale,
    searhProductSoldout
}    