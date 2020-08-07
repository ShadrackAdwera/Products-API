const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')

let DUMMY_PRODUCTS = [
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
      id: 'p3',
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

  //CREATE

  const createProduct = (req,res,next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      throw new HttpError('Invalid Inputs! Check your data',422)
    }

    const { name,description,images,sizes,colors,price,creator } = req.body

    const createdProduct = {
       id: uuid(),name,description,images,sizes,colors,price,creator
    }

    DUMMY_PRODUCTS.unshift(createdProduct)
    res.status(201).json({product: createdProduct}) 
}

//READ

const allProducts  = (req, res, next) => {
    res.json({ totalProducts: DUMMY_PRODUCTS.length, products: DUMMY_PRODUCTS });
  }

const productsById = (req,res,next) => {
    const productId = req.params.prodId
    const foundProduct = DUMMY_PRODUCTS.find(prod=>prod.id===productId)
    if(!foundProduct) {
        throw new HttpError('COuld not find product for the provided ID',404)
    }
    res.status(200).json({message:'Product Found',product: foundProduct})
}

const productsByUserId = (req,res,next) => {
    const userId = req.params.userId
    const foundProducts = DUMMY_PRODUCTS.filter(prod=>prod.creator===userId)
    if(!foundProducts) {
        throw new HttpError('Could not find product for the provided user ID',404)
    }
    res.status(200).json({totalProducts: foundProducts.length, products: foundProducts})
}

//UPDATE

const updateProduct = (req,res,next) => {

  const error = validationResult(req)
  if(!error.isEmpty()) {
    throw new HttpError('Invalid inputs, try again',422)
  }

    const productId = req.params.prodId
    const foundProduct = {...DUMMY_PRODUCTS.find(prod=>prod.id===productId)}
    if(!foundProduct) {
        throw new HttpError('COuld not find product for the provided ID', 404)
    }
    const { name,description,images,sizes,colors,price,creator } = req.body

    const placeIndex = DUMMY_PRODUCTS.findIndex(prod=>prod.id===productId)

    foundProduct.name = name
    foundProduct.description = description
    foundProduct.images = images
    foundProduct.sizes = sizes
    foundProduct.colors = colors
    foundProduct.price = price
    foundProduct.creator = creator

    DUMMY_PRODUCTS[placeIndex] = foundProduct

    res.status(200).json({message:'Product Updated', product: foundProduct}) 
}

//DELETE

const deleteProduct = (req,res,next) => {
    const productId = req.params.prodId
    DUMMY_PRODUCTS = DUMMY_PRODUCTS.filter(prod=>prod.id!==productId)
    res.status(200).json({message: 'Product Deleted'})
}
  

  exports.allProducts = allProducts
  exports.productsById = productsById
  exports.productsByUserId = productsByUserId
  exports.createProduct = createProduct
  exports.updateProduct = updateProduct
  exports.deleteProduct = deleteProduct