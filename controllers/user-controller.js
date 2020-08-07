const { validationResult } = require('express-validator');
const { v4: uuid } = require('uuid');
const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../utils/location');
const User = require('../models/user');

const allUsers = async (req, res, next) => {
  const users = await User.find({}, '-password');
  res
    .status(200)
    .json({
      foundUsers: users.length,
      users: users.map((user) => user.toObject({ getters: true })),
    });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  let foundUser
  try {
    foundUser = await User.findById(userId).exec()
  } catch (error) {
      return next(new HttpError('Fetch user failed',500))
  }

  if (!foundUser) {
    throw new HttpError('Could not find user for the provided ID', 404);
  }
  res.status(200).json({ message: 'User Found', user: foundUser });
};

const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        'Use a valid email, password must be longer than 6 characters',
        422
      )
    );
  }
  const { name, image, email, password, address } = req.body;
  let foundEmail;
  try {
    foundEmail = await User.findOne({ email: email }).exec();
  } catch (error) {
    return next(new HttpError('Could not fetch email', 500));
  }
  if (foundEmail) {
    return next(new Error('Email exists,try logging in', 403));
  }

  let coordinates;

  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (error) {
    return next(error);
  }

  let result;
  const createdUser = new User({
    name,
    image,
    address,
    pin: coordinates,
    email,
    password,
    products:[],
  });

  try {
    result = await createdUser.save();
  } catch (error) {
    return next(new HttpError('Auth Failed', 401));
  }

  res
    .status(201)
    .json({
      message: 'Sign Up Successful',
      user: result.toObject({ getters: true }),
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundEmail;
  try {
    foundEmail = await User.findOne({ email: email }).exec();
  } catch (error) {
    return next(new HttpError('Could not validate email', 500));
  }

  if (!foundEmail || foundEmail.password !== password) {
    return next(new HttpError('Auth failed', 401));
  }
  res.status(200).json({ message: 'Login Successful!' });
};

exports.allUsers = allUsers;
exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
