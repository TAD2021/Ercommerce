'use strict';

const express = require('express');
const accessController = require('../../controllers/access.troller');
const router = express.Router();

// signUp
router.post('/shop/signup', accessController.signUp)

module.exports = router