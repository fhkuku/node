'use strict'
var User = require('../models/user')
var Helps = require('../models/helps')
var jwt = require('../services/jwt')

var bcrypt = require("bcrypt-nodejs")
var fs = require("fs")
var path = require('path')

var controller = {
    saveUser: function (req, res) {
        var user = new User()
        var params = JSON.parse(req.body.body)
        var listValidations = {
            "name": "Nombre",
            "email": "Correo electronico",
            "password": "Contraseña",
            "confirmPass": "Confirmar contraseña",
            "role": "Tipo de usuario"
        }
        
        var validationResult = Helps.validate(listValidations, params)
        if (validationResult.isValidate) {
            user.name = params.name
            user.email = params.email.toLowerCase()
            user.role = params.role

            User.findOne({ email: user.email }, (err, isExistUser) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error al validar el usuario", "find500")
                } if (!isExistUser) {
                    var imagenResult = Helps.validarImagen(req)
                    if (imagenResult.isValidate) {
                        user.image = imagenResult.fileName
                        bcrypt.hash(params.password, null, null, (err, hash) => {
                            user.password = hash
                            user.save((err, userStore) => {
                                if (err) {
                                    return Helps.error(res, "Se genero un error","save500")
                                } if (!userStore) {
                                    return Helps.error(res, "No se ha podido guardar el usuario","saveError")
                                }
                                return Helps.success(res, "Tu cuenta ha sido creada exitosamente","saveOk")
                            })
                        })
                    } else {
                        fs.unlink(imagenResult.fileName, (err, delte) => {
                            return Helps.success(res, "Extension no valida", "extension")
                        })
                    }
                } else {
                    return Helps.success(res, "3", "existe")
                }
            })
        } else {
            return Helps.success(res, "Debe validar el campo " + validationResult.isNotValide, "vacio")
        }
    },
    login:(req, res)=> {
        var params = req.body
        var listValidation = { "email": "Correo electronico", "password": "Contraseña" }
        var validationResult = Helps.validate(listValidation, params);
        if (validationResult.isValidate) {
            User.findOne({ email: params.email.toLowerCase() }, (err, isExistUser) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error al consultar su usuario","error")
                } if (!isExistUser) {
                    return Helps.success(res, "Usuario/contraseña incorrecta","incorrect")
                }
                bcrypt.compare(params.password, isExistUser.password, (err, isCheck) => {
                    if (err) {
                        return Helps.error(res, "Se ha generado un error al verificar las credenciales", "error")
                    } if (isCheck) {
                        if (params.getToken) {
                            return Helps.successToken(res, jwt.createToken(isExistUser),"ok")
                        }
                        isExistUser.password = undefined
                        return Helps.success(res, isExistUser,"ok")
                    } else {
                        return Helps.success(res, "Usuario/contraseña incorrecta", "incorrect")
                    }
                })
            })
        } else {
            return Helps.success(res, "Debe validar el campo " + validationResult.isNotValide)
        }
    },
    uploadAvatar: function (req, res) {
        var allowedExt = ["png", "jpg", "jpeg"]
        var fileName = "Avatar no subido.."
        if (!req.files.file) {
            return Helps.notFound(res, "No se ha seleccionado una imagen")
        }
        var filePath = req.files.file.path;
        //TODO windows -- var fileSplit = filePath.split('\\');
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[2]
        var extSplit = fileName.split("\.")
        var fileExt = extSplit[1].toLocaleLowerCase()
        if (allowedExt.includes(fileExt)) { 
            User.findOneAndUpdate({ _id: req.user.sub }, { image: fileName }, { new: true }, (err, update) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error al subir la imagen")
                }
                return Helps.success(res, "se ha guardado correctamente")
            })
        } else {
            fs.unlink(filePath, (err, delte) => {
                return Helps.notFound(res, "Extension no valida")
                console.log("no valido")
            })
        }
    },
    getAvatar(req, res) {
        var fileName = req.params.fileName
        var pathFile = "./uploads/user/" + fileName
        fs.exists(pathFile, (exist) => {
            if (exist) {
                return res.sendFile(path.resolve(pathFile))
            } else {
                return Helps.notFound(res, "La imagen no existe")
            }
        })
    }
    /*update: function (req, res) {
        var listValidations = {
            "name": "Nombre",
            "surname": "Usuario",
            "email": "Correo electronico",
            "image": "Imagen"
        }
        var params = req.body
        var validationResult = Helps.validate(listValidations, params)
        if (!validationResult.isValidate) {
            return Helps.error(res, "Faltan datos " + validationResult.isNotValide)
        }
        delete params.password

        if (req.user.email != params.email) {
            User.findOne({ email: params.email.toLowerCase() }, (err, users) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error al validar el usuario")
                }
                if (users && users.email == params.email) {
                    return Helps.success(res, "No puede ser modificado")
                }
            });
        } else {
            User.findOneAndUpdate({ _id: req.user.sub }, params, { new: true }, (err, isUpdate) => {
                console.log("entro")
                if (err) {
                    return Helps.error(res, "Se ha generado un error al actualizar")
                }
                if (!isUpdate) {
                    return Helps.success(res, "No se actualizo el usuario")
                }
                Helps.success(res, isUpdate)
            });
        }

    }*/

}
module.exports = controller