const express = require('express');

const router = express.Router();

const HttpError = require('../models/http-error')

const productController = require('../controllers/product-controller')

router.get('/', productController.allProducts);
router.get('/:prodId', productController.productsById);
router.get('/user/:userId', productController.productsByUserId);
router.post('/new', productController.createProduct)

module.exports = router;
