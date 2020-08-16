const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const productFileUpload = require('../middleware/product-file-upload')

const productController = require('../controllers/product-controller');

const checkAuth = require('../middleware/check-auth')

router.get('/', productController.allProducts);


router.get('/:prodId', productController.productsById);
router.get('/user/:userId', productController.productsByUserId);

router.use(checkAuth)

router.post(
  '/new',
  productFileUpload.array('images',4),
  [
    check('name').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('price').isNumeric(),
  ],
  productController.createProduct
);
router.patch(
  '/:prodId',
  [
    check('name').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('price').isNumeric(),
  ],
  productController.updateProduct
);
router.delete('/:prodId', productController.deleteProduct);

module.exports = router;
