'use strict';

const {clothing, electronic, product} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response');
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');
const { insertInventory } = require('../models/repositories/inventory.repo');

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

    static async updateProduct(type, productId, payload){
        switch (type) {
            case 'Electronics':
                return new Electronics(payload).updateProduct(productId)
            case 'Clothing':
                return new Clothing(payload).updateProduct(productId)
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }

    // PUT //
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }
    // END PUT //

    //query
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async getListSearchProduct({keySearch}){
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}){
        return await findAllProducts({limit, sort, filter, page, 
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({product_id}){
        return await findProduct({product_id, unSelect: ['__v']})
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
        const newProduct = await product.create({...this, _id: product_id})
        if(newProduct){
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct
    }

    // update product
    async updateProduct(productId, bodyUpdate){
        return await updateProductById({productId, bodyUpdate, model: product})
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

    async updateProduct(productId){
        const objectParams = removeUndefinedObject(this)
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
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

    async updateProduct(productId){
        const objectParams = removeUndefinedObject(this)
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: electronic
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

module.exports = ProductFactory