const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const Product = require('../models/products')

  //CREATE

  const createProduct = async (req,res,next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      throw new HttpError('Invalid Inputs! Check your data',422)
    }

    const { name,description,imageUrls,sizes,colors,price,creator } = req.body

    // const createdProduct = {
    //    name,description,images,sizes,colors,price,creator
    // }
    let result
    const createdProduct = new Product({name,description,imageUrls,sizes,colors,price,creator})
    try {
      result = await createdProduct.save()
    } catch (error) {
      return next(new HttpError('Fail to save product',400))
    }

    res.status(201).json({message: 'Product Created', product:result}) 
}

//READ

const allProducts  = async (req, res, next) => {
    const fetchedProducts = await Product.find().exec()
    res.status(200).json({totalProducts: fetchedProducts.length, products: fetchedProducts})
  }

const productsById = async (req,res,next) => {
    const productId = req.params.prodId
    let foundProduct
    try {
      foundProduct = await Product.findById(productId).exec()
    } catch (error) {
      return next(new HttpError('Fetch product failed',500))
    } 
    if(!foundProduct) {
        return next(new HttpError('COuld not find product for the provided ID',404)) 
    }
    res.status(200).json({message:'Product Found',product: foundProduct.toObject({getters: true})})
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
    const foundProduct = DUMMY_PRODUCTS.find(prod=>prod.id===productId)
    if(!foundProduct) {
      throw new HttpError('Could not find product for the specified ID',400)
    }
    DUMMY_PRODUCTS = DUMMY_PRODUCTS.filter(prod=>prod.id!==productId  )
    res.status(200).json({message: 'Product Deleted'})
}
  

  exports.allProducts = allProducts
  exports.productsById = productsById
  exports.productsByUserId = productsByUserId
  exports.createProduct = createProduct
  exports.updateProduct = updateProduct
  exports.deleteProduct = deleteProduct