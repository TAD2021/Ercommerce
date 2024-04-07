'use strict';

const { model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: {type: Number, require: true},
    order_checkout: {type: Object, require: true},
    /*
        order_checkout = {
            totalPrice,
            totalApllyDiscount,
            feeShip
        }
    */
    order_shipping: {type: Object, require: true},
    /*
        street,
        city,
        state,
        country
    */
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, require: true},
    order_trackingNumber: {type: String, default: '41425235235'},
    order_status: {type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'}
},{
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, orderSchema)