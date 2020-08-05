const express = require('express');

const router = express.Router();

const productController = require('../controllers/product-controller')

router.get('/', productController.allProducts);
router.get('/:prodId', productController.productsById);
router.get('/user/:userId', productController.productsByUserId);
router.post('/new', productController.createProduct)
router.patch('/:prodId', productController.updateProduct)
router.delete('/:prodId', productController.deleteProduct)

module.exports = router;
