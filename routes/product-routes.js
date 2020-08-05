const express = require('express');

const router = express.Router();

const HttpError = require('../models/http-error')

const productController = require('../controllers/product-controller')

router.get('/', productController.allProducts);
router.get('/:prodId', productController.productsById);

router.get('/user/:userId', (req, res, next) => {
  const foundUserId = req.params.userId;
  const foundProducts = DUMMY_PRODUCTS.filter(
    (prod) => prod.creator === foundUserId
  );
  if(!foundProducts) {
    //return res.status(404).json({error:'Could not find product for the provided User ID'})
    throw new HttpError('Could not find product for the provided User ID',404)
}
  res.json({ productsFound: foundProducts.length, products: foundProducts });
});

module.exports = router;