'use strict'
var Manual = require("../models/manual")
var Helps = require("../models/helps")
var controller = {
    agregar:(req, res)=>{
        var listValidation = {"content":"Comentario"}
        var idManual = req.params.id
        var params = req.body 
        Manual.findById(idManual).exec((err, manual)=>{
            if(err){
                return Helps.error(res, "Se ha generado un error")
            }if(!manual){
                return Helps.error(res, "No existe este manual")
            }
            if(params.content){
                var validationResult = Helps.validate(listValidation,params)
                if(validationResult.isValidate){
                    var comentario = {
                        user:req.user.sub,
                        content : params.content
                    }
                    manual.comentarios.push(comentario)
                    manual.save((err)=>{
                        if(err){
                            return Helps.error(res, "Se ha generado un error")
                        }

                        return Helps.success(res, "Se ha guardado correctamente el comentario")
                    })

                }else{
                    Helps.notFound(res, "Debes escribir un comentario")
                }
            }
        })

    },

}

module.exports = controller