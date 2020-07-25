'use strict'
var paypal = require('paypal-rest-sdk')
var Helps = require('../models/helps')
var Paypal = require("../models/paypal")
var productos=[]
var controller = {
    pagar: function (req, res) {
       productos = [{
            "name": "item",
            "sku": "5f166ff75d5b2018ef266cbf",
            "price": "0.01",
            "currency": "MXN",
            "quantity": 1,
        },
        {
            "name": "item2",
            "sku": "5f1670075d5b2018ef266cc0",
            "price": "0.01",
            "currency": "MXN",
            "quantity": 1
        }]
        var total = 0;
        for(let i = 0;i <productos.length;i++){
            total += parseFloat(productos[i].price)
        }
        var json_paypal = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3700/api/success",
                "cancel_url": "http://localhost:3700/api/return"
            },
            "transactions": [{
                "item_list": {
                    "items": productos
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
                        
                        res.redirect(payment.links[i].href)
                    }
                }
            }
        });
    },
    success: function (req, res) {
        var paypal = new Paypal();
        paypal.paymentId = req.query.paymentId
        paypal.PayerID = req.query.PayerID
        paypal.user ='5f0eb47db2f2f216d5bd36ae'
        for(let i =0; i<productos.length;i++){
            //paypal.manuales.m=productos[i].sku
            //paypal.manuales.c = productos[i].quantity
            var _id =productos[i].sku
            var cantidad = productos[i].quantity
            paypal.manuales.push({_id,cantidad})
        }
        paypal.save((err, stored)=>{
            if(stored){
                Paypal.find().populate("user").populate("manuales._id").exec((err,isok)=>{
                    return Helps.success(res,isok)
                })
            }else{
                
                return Helps.error(res, err)
            }
        }) 
    },
    getCompras:function(req, res){
        Paypal.find({user:'5f0eb47db2f2f216d5bd36ae'}).populate('user').populate('manuales._id').exec((err,pagos)=>{
            console.log(pagos)
            return Helps.success(res, pagos)
        })
    }
}

module.exports = controller