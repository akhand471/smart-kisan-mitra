const express = require('express');
const router = express.Router();
const { calculateCrop } = require('../controllers/cropController');

router.post('/calculate', calculateCrop);

module.exports = router;
