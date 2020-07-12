'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'la-clave-inhackeable1';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(15, "days").unix()
    }
    return jwt.encode(payload, key);
}