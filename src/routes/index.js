const express = require('express');
const authRoutes = require('./auth.routes');
const commodityRoutes = require('./commodity.route');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes'); 
const sellerRoutes = require('./seller.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', commodityRoutes);
router.use('/', cartRoutes);
router.use('/', orderRoutes);
router.use('/admin', adminRoutes); 
router.use('/seller', sellerRoutes);

module.exports = router;