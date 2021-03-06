const fs = require('fs')
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const productRoutes = require('./routes/product-routes');
const userRoutes = require('./routes/user-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads','images')))
app.use('/public', express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, PATCH, POST, DELETE, GET'
  );
  next();
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find the method / route. Try Again', 500);
});

app.use((error, req, res, next) => {
  if(req.file) {
    fs.unlink(req.file.path, (err)=>{
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ error: error.message || 'An error occured, try again' });
});

const url = `mongodb+srv://adwesh:${process.env.DB_PASSWORD}@cluster0.ze0xp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(url)
  .then(() => app.listen(5000))
  .catch(() => console.log('Connection failed!'));
