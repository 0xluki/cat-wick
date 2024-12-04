const express = require('express');
const router = express.Router();
const productController = require("../controllers/product");

router.get('/product/:prodId', productController.getProduct);
router.post('/product', productController.postProduct);

module.exports = router