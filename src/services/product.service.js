'use strict';

const {clothing, electronic, product} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')

// define Factory class to create product
class ProductFactory {
    static async createProduct(type, payload){
        switch (type) {
            case 'Electronics':
                return new Electronics(payload).createProduct(payload)
            case 'Clothing':
                return new Clothing(payload).createProduct(payload)
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

// define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_shop, product_attributes, product_type
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_type = product_type
    }

    //create new product
    async createProduct(product_id){
        return await product.create({...this, _id: product_id})
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

// Define sub-class for different product types Electronics
class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new Electronics error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

module.exports = ProductFactory