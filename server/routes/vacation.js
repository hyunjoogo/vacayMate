const express = require('express');
const router = express.Router();
const vacationTypeController = require('../controllers/vacationTypeController');
const requestVacationController = require('../controllers/requestVacationController');


// POST /vacation
router.post('/', vacationTypeController.create);

// POST /vacation/request
router.post('/request', requestVacationController.createRequest);

module.exports = router;
