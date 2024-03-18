'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.error(`error verifying access token`, err)
            }else{
                console.log(`decode verified access token`, decode)
            }
        })

        return { accessToken, refreshToken}
    } catch (err) {

    }
}

const authentication = asyncHandler( async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userid')
        req.keyStore = keyStore
        return next()
    }catch(error) {
        throw error 
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.vaerify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}