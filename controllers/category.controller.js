'use strict'

var Category = require('../models/category.model');
var Product = require('../models/product.model');

function saveCategory(req,res){
    var category = new Category();
    var params = req.body;

    if(params.name && params.description){
        Category.findOne({name:params.name}, (err, cateFind)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(cateFind){
                res.send({message:'La categoria con ese nombre ya existe'});
            }else{
                category.name = params.name;
                category.description = params.description;

                category.save((err, cateSaved)=>{
                    if(err){
                        res.status(500).send({message:'Error en el servidor'});
                    }else if(cateSaved){
                        res.send({cateSaved:cateSaved});
                    }else{
                        res.status(418).send({message:'Categoria no guardada'});
                    }
                });
            }
        });
    }else{
        res.send({message:'Ingrese todos los campos'});
    }
}

function updateCategory(req, res){
    let cateId = req.params.id;
    let update = req.body;
     
        Category.findByIdAndUpdate(cateId, update , {new:true}, (err, cateUpdated)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(cateUpdated){
                res.send({cateUpdated:cateUpdated});
            }else{
                res.status(418).send({message:'No se pudo actualizar la categoria'});
            }
        });
}

function removeCategory(req, res){
    let cateId = req.params.id;

    Category.findByIdAndRemove(cateId, (err, cateRemove)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'})
        }else if(cateRemove){
            Category.findOne({name:'Otros'},(err, cateFind)=>{
                Product.updateMany({category:cateId},{category:cateFind._id}, (err,ProductsUpdated)=>{
                    if(err){
                        res.status(500).send({message:'Error en el servidor'});
                    }else if(ProductsUpdated){
                        res.send({message:'Categoria eliminada'});
                    }else{
                        res.status(418).send({message:'Error al actualizar la categoria'});
                    }
                });
            });
        }else{
            res.status(418).send({message:'No se pudo actualizar'});
        }
    });
}

function listCategories(req, res){
    Category.find({}, (err, categories)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(categories){
            res.send({categories:categories});
        }else{
            res.status(404).send({message:'No hay categorias las cuales mostrar'})
        }
    })
}

module.exports = {
    saveCategory,
    updateCategory, 
    removeCategory, 
    listCategories
}