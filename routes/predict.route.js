const express = require('express');
const router = express.Router();

//Load Controllers
const {
    spectrogramController,
    predictController,
} = require('../controllers/predict.controller.js')


router.post('/spectrogram/new', spectrogramController);
router.post('/predict/new', predictController);

module.exports = router;