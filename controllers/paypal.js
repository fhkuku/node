'use strict'
var paypal = require('paypal-rest-sdk')
var Helps = require('../models/helps')
var Paypal = require("../models/paypal")
var Manual = require("../models/manual")
var fs = require("fs")
var path = require('path')
var moment = require("moment")

var paypal_json
var total_global
var userId
var controller = {
    pagar: function (req, res) {
        paypal_json = req.body.paypalJson
        var total = req.body.total
        userId = req.user.sub
        total_global = total
        var json_paypal = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://helps-books.herokuapp.com/api/success",
                "cancel_url": "http://localhost:3700/api/return"
            },
            "transactions": [{
                "item_list": {
                    "items": paypal_json
                },
                "amount": {
                    "currency": "MXN",
                    "total": total
                },
                "description": "This is the payment description."
            }]
        };
        paypal.payment.create(json_paypal, function (error, payment) {
            if (error) {
                Helps.error(res, error)
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        return Helps.success(res, payment.links[i].href, "url_paypal")
                    }
                }
            }
        });
        /*   productos = [{
                "name": "item",
                "sku": "5f1be853ad9edfd6d20c8228",
                "price": "0.01",
                "currency": "MXN",
                "quantity": 1,
            },
            {
                "name": "item2",
                "sku": "5f1be853ad9edfd6d20c8228",
                "price": "0.01",
                "currency": "MXN",
                "quantity": 1
            }] */
        /*    var total = 0;
           for (let i = 0; i < productos.length; i++) {
               total += parseFloat(productos[i].price)
           } */

    },
    success: (req, res) => {
        var paypal = new Paypal();
        paypal.paymentId = req.query.paymentId
        paypal.PayerID = req.query.PayerID
        paypal.user = userId
        paypal.total = total_global
        var execute_payment_json = {
            "payer_id": paypal.PayerID,
            "transactions": [{
                "amount": {
                    "currency": "MXN",
                    "total": paypal.total
                }
            }]
        };
        
        var paymentId = paypal.paymentId;
        
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log("error perro")
                console.log(error.response);
                throw error;
            } else {
                for (let i = 0; i < paypal_json.length; i++) {
                    var _id = paypal_json[i].sku
                    var cantidad = paypal_json[i].quantity
                    paypal.manuales.push({ _id, cantidad })
                    Manual.update({ _id: _id }, { $inc: { stock: -cantidad } }, { new: true }, (err, ok) => {
                    })
                }
                paypal.save((err, stored) => {
                    if (stored) {
                        Paypal.find({ _id: stored._id }).populate("manuales._id").exec((err, isok) => {
                            res.redirect('https://helps-book.herokuapp.com/confirmacion/' + JSON.stringify(isok));
                        })
                    } else {
                        return Helps.error(res, err)
                    }
                })
            }
        });
       
    },
    getVentaDetalle: function (req, res) {
        var _id = req.params.id
        Paypal.find({ _id: _id }).populate('user').populate('manuales._id').exec((err, pagos) => {
            return Helps.success(res, pagos)
        })
    },
    getTotalVenta: function (req, res) {
        Paypal.find().exec((err, venta) => {
            return Helps.success(res, venta)
        })
    },
    getMasVendido: (req, res) => {
        Manual.find().limit(4).exec((err, manual) => {
            return Helps.success(res, manual)
        })
    },
    getFile: (req, res) => {
        var fileName = req.params.fichero
        var pathFile = "./uploads/user/" + fileName
        fs.exists(pathFile, (exist) => {
            if (exist) {
                return res.sendFile(path.resolve(pathFile))
            } else {
                return Helps.success(res, "La imagen no existe")
            }
        })

    },

}

module.exports = controller