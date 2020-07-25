'use strict'
var jwt = require("jwt-simple")
var moment  = require("moment")
var secret = "clave-test"

exports.auth = function(req, res, next){
    console.log("estas pasando por el middleware")
    if(!req.headers.authorization){
        return res.status(403).send({
            mensaje:"No tienes la cabecera de autenticacion"
        })
    }
    var token = req.headers.authorization.replace(/[""]+/g,'')
    try {
        var payload = jwt.decode(token, secret)
        if(payload.exp <= moment.unix()){
            return res.status(404).send({
                mensaje:"El token ha expirado"
            })
        }
    } catch (ex) {
        return res.status(404).send({
            mensaje:"El token no es valido"
        })
    }
    req.user = payload
    next()
}