'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var paypal = require("paypal-rest-sdk")

//TODO ejecutar express e invocamos, activando el framework
var app = express()


//TODO Archivos de rutas
var manual_routes = require('./routes/manual')
var user_routes = require('./routes/user')
var paypal_routes = require('./routes/paypal')
var comenrario_routes = require("./routes/comentario")
//TODO middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//TODO Corse
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Content-Length, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//TODO inicializar paypal
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AakUUzr_BjDBpdkBPD7yC0ThFoKOVQcsg1AlBpgYwRnM5ZOyUWhtoYU6N4VXcvOo0zYiBp5_oTZ5fYYx',
    'client_secret': 'EGiUiiJBYzFHHk2eIbrLMBR0d3tjHGn7wg0hEQtgFyt44ydfPb5lVUe4WAMjv6skOdujJ7xr7mOnQ7N-'
});


//TODO Rutas
app.use('/api', [manual_routes, user_routes,paypal_routes,comenrario_routes])


//TODO exportar

module.exports = app


