const express = require('express');
const authRoutes = require('./auth.routes');
const commodityRoutes = require('./commodity.route');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes'); 

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', commodityRoutes);
router.use('/', cartRoutes);
router.use('/', orderRoutes);
router.use('/admin', adminRoutes); 

module.exports = router;