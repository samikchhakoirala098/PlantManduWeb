const express = require('express');
const { placeOrder, getMyOrders, getAllOrders, confirmOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/confirm', protect, admin, confirmOrder);

module.exports = router;
