const express = require('express');
const router = express.Router();
const vacationTypeController = require('../controllers/vacationTypeController');

// POST /vacation
router.post('/', vacationTypeController.create);

module.exports = router;
