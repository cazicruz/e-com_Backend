const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/adminController')
const { authenticateToken } = require('../../middleware/auth');


// router.get('/3rdPartyData',authenticateToken, AdminController.fetchDataPlans)

module.exports = router;