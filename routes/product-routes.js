const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const productController = require('../controllers/product-controller')

router.get('/', productController.allProducts);
router.get('/:prodId', productController.productsById);
router.get('/user/:userId', productController.productsByUserId);

router.post('/new',[check('name').not().isEmpty(), check('description').isLength({min:5}),check('price').isNumeric() ], productController.createProduct)
router.patch('/:prodId', productController.updateProduct)
router.delete('/:prodId', productController.deleteProduct)

module.exports = router;
