const express = require('express');

const { infoController } = require('../../controllers');
const userRoutes = require('./user-routes');

const router = express.Router();

router.get('/info', infoController.info);

// Mount userRoutes at /signup
router.use('/user', userRoutes);

module.exports = router;
