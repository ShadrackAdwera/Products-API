const { v4:uuid } = require('uuid')
const HttpError = require('../models/http-error')

const DUMMY_USERS = [
    {
        id: uuid(),
        name: 'Deez Nuts',
        email:'deez@nuts.com',
        password: 'jammer'
    },
    {
        id: uuid(),
        name: 'Deez Two',
        email:'deez@test.com',
        password: 'tester'
    },
    {
        id: uuid(),
        name: 'Deez Three',
        email:'deez@three.com',
        password: 'password'
    }
]

const allUsers = (req,res,next) => {
 res.status(200).json({numberOfUsers: DUMMY_USERS.length, users: DUMMY_USERS})   
}

const signUp = (req,res,next) => {
    const { name,email,password } = req.body
    const createdUser = { id: uuid(),name, email, password}
    DUMMY_USERS.unshift(createdUser)
    res.status(201).json({message: 'Sign Up Successful',user: createdUser})
}

const login = (req,res,next) => {
    const { email, password } = req.body
    for(const user of DUMMY_USERS) {
        if(email===user.email && password===user.password) {
            res.status(200).json({message:'Login Successful'})
        } else {
            res.status(401).json({message:'Auth Failed'})
        }
    }
}

exports.allUsers = allUsers
exports.signUp = signUp
exports.login = login