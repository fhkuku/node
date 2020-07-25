'use strict'
var Manual = require('../models/manual')
var Helps = require('../models/helps')
var jwt = require('../services/jwt')
var bcrypt = require("bcrypt-nodejs")
var fs = require("fs")
var path = require('path')

var controller = {
    saveManual: (req, res)=> {
        var manual = new Manual();
        var params = JSON.parse(req.body.body)
        var listValidacion = {
            "title": "Titulo",
            "description": "Descripción",
            "price": "Precio",
            "stock": "Cantidad",
            "author": "Autor",
            "technology": "Tecnología",
        }
        var validationResult = Helps.validate(listValidacion, params)
        if (validationResult.isValidate) {
            manual.title = params.title.toLocaleUpperCase().trim()
            manual.description = params.description
            manual.price = params.price
            manual.stock = params.stock
            manual.author = params.author.toLocaleUpperCase().trim()
            manual.technology = params.technology
            Manual.findOne({ title: manual.title, author: manual.author }, (err, isExist) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error al guardar el manual","error")
                } if (!isExist) {
                    var imagenResult = Helps.validarImagen(req)
                    if(imagenResult.isValidate){
                        manual.image = imagenResult.fileName
                        var pdfResult = Helps.validarPdfZip(req)
                        if(pdfResult.isValidate){
                            manual.url = pdfResult.fileName
                            manual.save((err, manualStore) => {
                                if (err) {
                                    return Helps.error(res, "Se ha generado un error al guardar el manual","error")
                                } if (!manualStore) {
                                    return Helps.success(res, "No se ha podido guardar el manual, intentelo de nuevo", "again")
                                }
                                return Helps.success(res, "Se ha guardado correctamente el manual", "exito")
                            })
                        }else{
                            Helps.success(res, "Formato no valido", "pdf")
                        }

                    }else{
                        Helps.success(res, "Formato no valido", "image")
                    }
                } else {
                    return Helps.success(res, isExist, "exist")
                }
            })
        } else {
            return Helps.error(res, "Debe validar el campo " + validationResult.isNotValide)
        }
    },
    updateExist: (req, res)=> {
        var params = req.body
        var listValidation = { "stock": "Cantidad", "id": "ID" }
        var validationResult = Helps.validate(listValidation, params)
        if (validationResult.isValidate) {
            Manual.findOne({ _id: params.id }, (err, isExist) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error, actualice e intentelo de nuevo")
                }
                if (!isExist) {
                    return Helps.notFound(res, "No existe este manual")
                }
                Manual.findOneAndUpdate({ _id: params.id }, { stock: parseFloat(params.stock) + parseFloat(isExist.stock) }, { new: true },
                    (err, isUpdate) => {
                        if (err) {
                            return Helps.error(res, "Se ha generado un error")
                        }
                        if (!isUpdate) {
                            return Helps.notFound(res, "No se ha podido actualizar el stock")
                        }
                        return Helps.success(res, isUpdate)
                    })
            })
        } else {
            return Helps.error(res, "Exception Handler " + validationResult.isNotValide)
        }
    },
    getManuales:(req, res)=>{
        Manual.find().exec((err, manuales)=>{
            if(err || !manuales){
                return Helps.notFound(res, "No hay manuales por mostrar")
            }
            return Helps.success(res, manuales)
        })
    },
    getManual:(req, res)=>{
        var manualId = req.params.manualId
        Manual.findById(manualId).exec((err, manual)=>{
            if(err || !manual){
                return Helps.notFound(res, "No se ha encontrado el manual")
            }
            console.log(manual)
            return Helps.success(res, manual)
        })
    },
    buscar:(req, res)=>{
        var buscar = req.params.item
        console.log(buscar)
        Manual.find({"$or":[
            {"title":{"$regex":buscar, "$options":"i"}},
            {"description":{"$regex":buscar, "$options":"i"}},
            {"author":{"$regex": buscar, "$options":"i"}}
        ]}).exec((err, manual)=>{
            if(err){
                return Helps.error(res, "Se ha generado un error")
            }
            if(!manual){
                return Helps.notFound(res, "No hay manuales disponibles")
            }
            return Helps.success(res, manual)
        })
    },
    getMasVendido:(req, res)=>{
        return Helps.success(res, "HOla")
    }
}
module.exports = controller