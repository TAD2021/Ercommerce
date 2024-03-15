'use strict';

const mongoose = require('mongoose');
const connectString = 'mongodb+srv://admin:10102001@cluster0.ycjok.mongodb.net/ercommerce'
const {countConnect} = require('../helpers/check.connect')
// Singleton pattern
class Database {
    constructor(){
        this.connect()
    }

    connect(type = 'mongodb'){
        if(1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then( _ => {
            console.log('Connected Mongodb success', countConnect())
        })
        .catch(err => console.log('Error connecting to db'))
    }

    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb