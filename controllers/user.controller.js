'use strict'


var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.email && params.password){
        User.findOne({$or:[{username: params.username}, {email: params.email}]},(err, userFind)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(userFind){
                res.send({message:'Usuario con email o username ya existente'});
            }else{
                user.name = params.name;
                user.username = params.username;
                user.email = params.email;
                user.role = 'ROOT';

                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al encriptar contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al guardar usuario'});
                            }else if(userSaved){
                                res.send({message: 'Usuario creado', user: userSaved});
                            }else{
                                res.status(404).send({message: 'Usuario no guardado'});
                            }
                        });
                    }else{
                        res.status(418).send({message: 'Error inesperado'});
                    }
                });
            }
        });
    }else{
        res.send({message:'Ingrese todos los datos'});
    }
}

function login(req, res){
    var params = req.body;
    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createToken(check),message: 'Bienvenido',user:check});
                                }else{
                                    res.send({message: 'Bienvenido',user:check});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                }).populate('bills.cart');
        }else{
           res.send({message: 'Ingresa tu contraseña'}); 
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu username'});
    }
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    if('ADMIN'== req.user.role){
        if(update.role){
            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                }else if(userUpdated){
                    res.send({user: userUpdated});
                }else{
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }
            });
        }else{
            res.send({message:'Como admin solo puede cambiar el role del usuario'});
        }
    }
    else if(userId != req.user.sub){
        res.status(403).send({message:'No tiene los permisos requeridos'});
    }else{
        if(update.role){
            res.send({message:'No tienes los permisos para cambiar el role'})
        }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else if(userUpdated){
                res.send({user: userUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }
        });
        }
    }
}

function removeUser(req, res){
    var userId = req.params.id;

    if(userId != req.user.sub){
        res,status(403).send({message:'No tiene los permisos requeridos'});
    }else{
        User.findByIdAndRemove(userId, (err, userRemove)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'});
            }else if(userRemove){
                res.send({message:'Usuario Eliminado'});
            }else{
                res.status(418).send({message:'Usuario no eliminado'});
            }
        });
    }
}



module.exports = {
    saveUser, 
    login,
    updateUser, 
    removeUser
}