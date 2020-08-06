const express = require('express')
const bodyParser = require('body-parser')
const HttpError = require('./models/http-error')
const productRoutes = require('./routes/product-routes')
const userRoutes = require('./routes/user-routes')

const app = express()

app.use(bodyParser.json())

app.use('/api/products',productRoutes)
app.use('/api/user',userRoutes)

app.use((req,res,next)=>{
    throw new HttpError('Could not find the method / route. Try Again',500)
})

app.use((error,req,res,next)=>{
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({error: error.message || 'An error occured, try again'})
})

app.listen(5000)
