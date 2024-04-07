'use strict';

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmout } = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')
const {} = require('../models/order.model')
class CheckoutService {
    /**
     {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
     }
     */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }){
        // check cartId ton tai khong?
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not existes!')
        
        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = []
        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            const checkProductServer = await checkProductByServer(item_products)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong!!!')
            
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            },0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discounts ton tai > 0, check xem co hop le hay khong
            if(shop_discounts.length > 0){
                const { totalPrice, discount = 0 } = await getDiscountAmout({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout) 
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }){
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check lai xem co vuot ton kho hay khong
        // get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for(let i = 0; i < products.length; i++){
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }

        // check if co mot san pham het hang trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError(`Some products have been updated, please return to the cart`)
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_products: shop_order_ids_new
        })

        // Truong hop: new insert thanh cong, thi remove product co trong cart
        if(newOrder){
            // remove product in my cart
        }

        return newOrder
    }

    /*
        1. Query Order [Users]
    */
    // ...
}

module.exports = CheckoutService;