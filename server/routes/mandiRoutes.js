const express = require('express');
const router = express.Router();
const { getMandiPrices, getCrops, getStates } = require('../controllers/mandiController');

router.get('/', getMandiPrices);
router.get('/crops', getCrops);
router.get('/states', getStates);

module.exports = router;
