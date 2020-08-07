const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Product = require('../models/products');
const User = require('../models/user');

//CREATE

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid Inputs! Check your data', 422));
  }

  const {
    name,
    description,
    imageUrls,
    sizes,
    colors,
    price,
    creator,
  } = req.body;

  // const createdProduct = {
  //    name,description,images,sizes,colors,price,creator
  // }
  let result;
  const createdProduct = new Product({
    name,
    description,
    imageUrls,
    sizes,
    colors,
    price,
    creator,
  });

  let creatorForProduct;

  try {
    creatorForProduct = await User.findById(creator).exec();
  } catch (error) {
    return next(new HttpError('User does not exist! Try again', 500));
  }

  if (!creatorForProduct) {
    return next(new HttpError('User does not exist!', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    creatorForProduct.products.push(createdProduct);
    await creatorForProduct.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Fail to save product', 400));
  }

  res.status(201).json({ message: 'Product Created', product: createdProduct });
};

//READ

const allProducts = async (req, res, next) => {
  const fetchedProducts = await Product.find().exec();
  res
    .status(200)
    .json({ totalProducts: fetchedProducts.length, products: fetchedProducts });
};

const productsById = async (req, res, next) => {
  const productId = req.params.prodId;
  let foundProduct;
  try {
    foundProduct = await Product.findById(productId).exec();
  } catch (error) {
    return next(new HttpError('Fetch product failed', 500));
  }
  if (!foundProduct) {
    return next(
      new HttpError('COuld not find product for the provided ID', 404)
    );
  }
  res.status(200).json({
    message: 'Product Found',
    product: foundProduct.toObject({ getters: true }),
  });
};

const productsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let foundProducts;

  try {
    foundProducts = await Product.find({ creator: userId }).exec();
  } catch (error) {
    return next(new HttpError('Fetch products failed', 500));
  }

  if (!foundProducts) {
    return next(
      new HttpError('Could not find product for the provided user ID', 404)
    );
  }
  res.status(200).json({
    totalProducts: foundProducts.length,
    products: foundProducts.map((prod) => prod.toObject({ getters: true })),
  });
};

//UPDATE

const updateProduct = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs, try again', 422));
  }
  const productId = req.params.prodId;
  let foundProduct;

  try {
    foundProduct = await Product.findById(productId).exec();
  } catch (error) {
    return next(new HttpError('Could not find product', 404));
  }

  if (!foundProduct) {
    return next(
      new HttpError('COuld not find product for the provided ID', 404)
    );
  }

  const { name, description, images, sizes, colors, price, creator } = req.body;

  foundProduct.name = name;
  foundProduct.description = description;
  foundProduct.images = images;
  foundProduct.sizes = sizes;
  foundProduct.colors = colors;
  foundProduct.price = price;
  foundProduct.creator = creator;

  try {
    const result = await foundProduct.save();
  } catch (error) {
    return next(new HttpError('Could not update product, try again', 422));
  }
  res.status(200).json({
    message: 'Product Updated',
    product: foundProduct.toObject({ getters: true }),
  });
};

//DELETE

const deleteProduct = async (req, res, next) => {
  const productId = req.params.prodId;
  let foundProduct;

  try {
    foundProduct = await Product.findById(productId).populate('creator');
  } catch (error) {
    return next(new HttpError('Could not fetch product', 500));
  }

  if (!foundProduct) {
    return next(
      new HttpError('Could not find product for the specified ID', 400)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await foundProduct.remove({ session: sess });
    foundProduct.creator.products.pull(foundProduct);
    await foundProduct.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not delete product', 500));
  }

  res.status(200).json({ message: 'Product Deleted' });
};

exports.allProducts = allProducts;
exports.productsById = productsById;
exports.productsByUserId = productsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
