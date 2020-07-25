"use strict";

var mongoose = require("mongoose");

var schema = mongoose.Schema;
var paypalSchema = schema({
  paymentId: String,
  PayerID: String,
  total: Number,
  date: { type: Date, default: Date.now },
  user: { type: schema.ObjectId, ref: "User" },
  manuales: [
      {
        _id:{
          type: schema.ObjectId,
          ref: "Manual",
        },
        cantidad:{
            type:Number
        }
      },
    ],
});

module.exports = mongoose.model("Paypal", paypalSchema);
