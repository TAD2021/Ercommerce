'use strict';

const {product, electronic, clothing} = require('../../models/product.model');
const {Types} = require('mongoose');
const { getSelectData, unGetSelectData, convertToObjectId } = require('../../utils');

const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const searchProductByUser = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: { $search: regexSearch},
    }, {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()

    return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }, {
        $set: { isDraft: false, isPublished: true }
    }, { new: true });

    if (!foundShop) return null;

    return 1; // Assuming that one document was modified
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }, {
        $set: { isDraft: true, isPublished: false }
    }, { new: true });

    if (!foundShop) return null;

    return 1; // Assuming that one document was modified
};

const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}
 
const queryProduct = async({query, limit, skip}) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id')
            .sort({updateAt: -1})
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
}

const getProductById = async (productId) => {
    return await product.findOne({ _id: convertToObjectId(productId)}).lean()
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map( async product => {
        const foundProduct = await getProductById(product.productId)

        if(foundProduct){
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
    }))
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllPublishForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}