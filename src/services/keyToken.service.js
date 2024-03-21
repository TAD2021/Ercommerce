'use strict';

const {Types} = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try{
            console.log(refreshToken)
            const filter = { userId: userId }, update = {
                publicKey, privateKey, refreshToken, refreshTokensUsed: []
            }, options = { upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch(error){
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keytokenModel.findOne({userId: new Types.ObjectId(userId)}).lean()
    } 

    static removeKeyById = async (id) => {
        return await keytokenModel.findByIdAndDelete(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken}).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({userId: userId})
    }
}

module.exports = KeyTokenService