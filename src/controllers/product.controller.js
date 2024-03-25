'use strict';

const ProductService = require('../services/product.service')
const {SuccessResponse} = require('../core/success.response')

class ProductController{
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ... req.body,
                product_shop:req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product successfully',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop:req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product successfully',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop:req.user.userId
            })
        }).send(res)
    }

    // QUERY //
    /**
     * @desc Get all draft for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @param {JSON} res 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get draft list successfully',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get publish list successfully',
            metadata: await ProductService.findAllPublishForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get data list successfully',
            metadata: await ProductService.getListSearchProduct(req.params)
        }).send(res)
    }
    // END QUERY //
}

module.exports = new ProductController()