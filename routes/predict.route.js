const express = require('express');
const router = express.Router();

//Load Controllers
const {
    trainController,
    predictController,
} = require('../controllers/predict.controller.js')


router.post('/train/new', trainController);
router.post('/predict/new', predictController);

module.exports = router;