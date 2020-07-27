'use strict'

var mongoose = require("mongoose")

// TODO llamamos el app.js
var app = require('./app')

var port = process.env.PORT || 3700
mongoose.set('useFindAndModify',false)
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://ferhkuku:peluso@cluster0.u44qn.mongodb.net/helpsbooks?retryWrites=true&w=majority", { useNewUrlParser: true })
	.then(() => {
		console.log("Conexión establecida..")
		//creacion del servidor
		app.listen(port, () => {
			console.log("Servidor iniciado exitosamente url localhost:3700")
		})
	}).catch(err => {
		console.log(err)
	})