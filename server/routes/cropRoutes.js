const express = require('express');
const router = express.Router();
const { calculateCrop, recommendCrops } = require('../controllers/cropController');

router.post('/calculate', calculateCrop);
router.post('/recommend', recommendCrops);

module.exports = router;
