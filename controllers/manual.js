'use strict'
var Manual = require('../models/manual')
var Helps = require('../models/helps')
var fs = require("fs")

var controller = {
    saveManual: (req, res) => {
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
            var pdfResult = Helps.validarPdfZip(req)
            if (pdfResult.isValidate) {
                manual.url = pdfResult.fileName
                var imagenResult = Helps.validarImagen(req)
                if (imagenResult.isValidate) {
                    manual.image = imagenResult.fileName
                    Manual.findOne({ title: manual.title, author: manual.author }, (err, isExist) => {
                        if (err) {
                            return Helps.error(res, "Se ha generado un error al guardar el manual", "error")
                        } if (!isExist) {
                            manual.save((err, manualStore) => {
                                if (err) {
                                    return Helps.error(res, "Se ha generado un error al guardar el manual", "error")
                                } if (!manualStore) {
                                    return Helps.success(res, "No se ha podido guardar el manual, intentelo de nuevo", "again")
                                }
                                return Helps.success(res, "Se ha guardado correctamente el manual", "exito")
                            })
                        } else {
                            Helps.success(res, isExist, "exist")
                        }
                    })
                } else {
                    fs.unlink(imagenResult.fileName, (err, delte) => {
                        return Helps.success(res, "Formato no valido", "image")
                    })
                }
            } else {
                fs.unlink(pdfResult.fileName, (err, delte) => {
                    return Helps.success(res, "Formato no valido", "pdf")
                })
            }
        } else {
            return Helps.error(res, "Debe validar el campo " + validationResult.isNotValide)
        }
    },
    updateExist: (req, res) => {
        var params = req.body
        var listValidation = { "stock": "Cantidad", "_id": "ID" }
        var validationResult = Helps.validate(listValidation, params)
        if (validationResult.isValidate) {
            Manual.findOne({ _id: params._id }, (err, isExist) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error, actualice e intentelo de nuevo")
                }
                if (!isExist) {
                    return Helps.notFound(res, "No existe este manual")
                }
                Manual.findOneAndUpdate({ _id: params._id }, { stock: parseFloat(params.stock) + parseFloat(isExist.stock) }, { new: true },
                    (err, isUpdate) => {
                        if (err) {
                            return Helps.error(res, "Se ha generado un error")
                        }
                        if (!isUpdate) {
                            return Helps.success(res, "No se ha podido actualizar el stock")
                        }
                        return Helps.success(res, isUpdate, "success")
                    })
            })
        } else {
            return Helps.error(res, "Exception Handler " + validationResult.isNotValide)
        }
    },
    getManuales: (req, res) => {
        Manual.find().exec((err, manuales) => {
            if (err || !manuales) {
                return Helps.success(res, "No hay manuales por mostrar", "vacio")
            }
            return Helps.success(res, manuales, "existe")
        })
    },
    getProductos: (req, res) => {
        Manual.find().exec((err, manuales) => {
            if (err || !manuales) {
                return Helps.success(res, "No hay manuales por mostrar", "vacio")
            }
            return Helps.success(res, manuales, "existe")
        })
    },
    getManual: (req, res) => {
        var manualId = req.params.manualId
        Manual.findById(manualId).populate("user").populate("comentarios.user").exec((err, manual) => {
            if (err || !manual) {
                return Helps.success(res, "No se ha encontrado el manual", "vacio")
            }
            return Helps.success(res, manual, "existe")
        })
    },
    buscar: (req, res) => {
        var buscar = req.params.item
        console.log(buscar)
        Manual.find({
            "$or": [
                { "title": { "$regex": buscar, "$options": "i" } },
                { "description": { "$regex": buscar, "$options": "i" } },
                { "author": { "$regex": buscar, "$options": "i" } }
            ]
        }).exec((err, manual) => {
            if (err) {
                return Helps.error(res, "Se ha generado un error")
            }
            if (!manual) {
                return Helps.notFound(res, "No hay manuales disponibles")
            }
            return Helps.success(res, manual)
        })
    },
 
    updateManual: (req, res) => {
        var params = JSON.parse(req.body.body)
        var lastPathPdf = params.url
        var lastPathImage = params.image
        var ok = true
        if (req.files.fichero) {
            var pdfResult = Helps.validarPdfZip(req)
            if (pdfResult.isValidate) {
                params.url = pdfResult.fileName
                fs.unlink(pdfResult.delete[0]+"/"+pdfResult.delete[1]+"/"+lastPathPdf, (err, delte) => {
                })
            } else {
                fs.unlink(pdfResult.fileName, (err, delte) => {
                    ok =false
                    return Helps.success(res, "Formato no valido", "pdf")
                })
            }
        }else if (req.files.file) {
            var imagenResult = Helps.validarImagen(req)
            if (imagenResult.isValidate) {
                params.image = imagenResult.fileName
                fs.unlink(imagenResult.delete[0]+"/"+imagenResult.delete[1]+"/"+lastPathImage, (err, delte) => {
                })
            } else {
                fs.unlink(imagenResult.fileName, (err, delte) => {
                    ok = false
                    return Helps.success(res, "Formato no valido", "image")
                })
            }
        }
        if(ok){
            Manual.findOneAndUpdate({ _id: params._id }, params, { new: true }, (err, manual) => {
                if (err) {
                    return Helps.error(res, "Se ha generado un error al actualizar","error")
                }
                Helps.success(res, manual, "success")
            })
        }
       
       
    },
    deleteManual:(req, res)=>{
        var params = req.params
        Manual.findByIdAndDelete({_id:params._id}, (err, manual)=>{
            if(err){
                return Helps.error(res, err, "error")
            }
            return Helps.success(res, manual, "exito")
        })
    }
}
module.exports = controller