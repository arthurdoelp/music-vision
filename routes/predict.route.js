const express = require('express');
const router = express.Router();

//Load Controllers
const {
    trainController,
} = require('../controllers/predict.controller.js')


router.post('/train/new', trainController);

module.exports = router;