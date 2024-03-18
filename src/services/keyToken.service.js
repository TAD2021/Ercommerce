'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try{
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshToken: [], refreshToken
            }, options = { upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch(error){
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keytokenModel.findOne({userId: userId}).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.remove(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken}).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.findByIdAndDelete({userId: userId})
    }
}

module.exports = KeyTokenService