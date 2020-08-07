const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: {type:String, required: true},
    description: {type: String, required:true},
    imageUrls: {
        angleOne: {type: String, required: true},
        angleTwo: {type: String, required: true},
        angleThree: {type: String, required: true},
    },
    sizes: {
        sm: {type: Number, required: true},
        md: {type: Number, required: true},
        lg: {type: Number, required: true},
        xl: {type: Number, required: true},
    },
    colors: [ {type: String, required: true}],
    price: { type: Number, required: true},
    creator: {type: String, required: true},
})

module.exports = mongoose.model('Product',productsSchema)