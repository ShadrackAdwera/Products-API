const express = require('express')
const productRoutes = require('./routes/product-routes')

const app = express()

app.use('/api/products',productRoutes)

app.use((error,req,res,next)=>{
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({error: error.message || 'An error occured, try again'})
})

app.listen(5000)
