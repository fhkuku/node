'use strict'

var mongoose = require('mongoose')

var schema = mongoose.Schema
var commentSchema = schema({
    content:String,
    date:{type:Date, default:Date.now},
    user:{type:schema.ObjectId,ref:'User'},
})
var comment = mongoose.model('Comentario',commentSchema)
var manualSchema = schema({
    title:String,
    description:String,
    price:String, 
    stock:Number, 
    author:String,
    technology:String,
    image:String,
    url:String,
    comentarios:[commentSchema]
})
module.exports = mongoose.model('Manual', manualSchema)