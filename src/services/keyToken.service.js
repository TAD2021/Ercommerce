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
}

module.exports = KeyTokenService