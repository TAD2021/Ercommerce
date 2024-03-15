'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try{
            const tokens = await keytokenModel.create({
                user: userId,
                privateKey,
                publicKey
            })
            return tokens ? tokens.publicKey : null
        } catch(e){
            return e
        }
    }
}

module.exports = KeyTokenService