const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN'
        if(!token) {
            throw new Error('Auth failed!')
        }
        const decodedToken = jwt.verify(token, 'likon_deez_nuts')
        req.userData = { userId: decodedToken.userId }
    } catch (error) {
        return next(new HttpError('Auth failed!',401))
    }

}