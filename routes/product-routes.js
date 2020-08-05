const express = require('express');

const router = express.Router();

const HttpError = require('../models/http-error')

const DUMMY_PRODUCTS = [
  {
    id: 'p1',
    name: 'Suit One',
    description: 'Drip Asf One',
    images: {
      angleOne:
        'https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
      angleTwo:
        'https://images.unsplash.com/photo-1593032534613-085f25474cae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      angleThree:
        'https://images.unsplash.com/photo-1472417583565-62e7bdeda490?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    },
    sizes: {
      sm: 3,
      md: 4,
      lg: 3,
      xl: 1,
    },
    colors: ['blue', 'gray', 'black', 'maroon'],
    price: 16000,
    creator: 'u1',
  },
  {
    id: 'p2',
    name: 'Suit Two',
    description: 'Drip Asf Two',
    images: {
      angleOne:
        'https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
      angleTwo:
        'https://images.unsplash.com/photo-1593032534613-085f25474cae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      angleThree:
        'https://images.unsplash.com/photo-1472417583565-62e7bdeda490?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    },
    sizes: {
      sm: 3,
      md: 4,
      lg: 3,
      xl: 1,
    },
    colors: ['blue', 'gray', 'black', 'maroon'],
    price: 16000,
    creator: 'u1',
  },
  {
    id: 'p2',
    name: 'Suit Three',
    description: 'Drip Three Asf',
    images: {
      angleOne:
        'https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
      angleTwo:
        'https://images.unsplash.com/photo-1593032534613-085f25474cae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      angleThree:
        'https://images.unsplash.com/photo-1472417583565-62e7bdeda490?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    },
    sizes: {
      sm: 3,
      md: 4,
      lg: 3,
      xl: 1,
    },
    colors: ['blue', 'gray', 'black', 'maroon'],
    price: 16000,
    creator: 'u2',
  },
];

router.get('/', (req, res, next) => {
  res.json({ message: 'Product found', products: DUMMY_PRODUCTS });
});
router.get('/:id', (req, res, next) => {
  const productId = req.params.id;
  const foundProduct = DUMMY_PRODUCTS.find((prod) => prod.id === productId);
  if(!foundProduct) {
      //return res.status(404).json({error:'Could not find product for the provided ID'})
      throw new HttpError('Could not find product for the provided ID',404)
  }
  res.json({ message: 'Found Product', product: foundProduct });
});

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
