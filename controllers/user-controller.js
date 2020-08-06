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

const getUserById = (req,res,next) => {
    const userId = req.params.userId
    const foundUser = DUMMY_USERS.find(user=>user.id===userId)
    if(!foundUser) {
        throw new HttpError('Could not find user for the provided ID',404)
    }
    res.status(200).json({message:'User Found',user: foundUser})

}

const signUp = (req,res,next) => {
    const { name,email,password } = req.body
    const foundEmail = DUMMY_USERS.find(user=>user.email===email)
    if(foundEmail) {
        throw new Error('Email exists,try logging in',403)
    }
    const createdUser = { id: uuid(),name, email, password}
    DUMMY_USERS.unshift(createdUser)
    res.status(201).json({message: 'Sign Up Successful',user: createdUser})
}

const login = (req,res,next) => {
    const { email, password } = req.body
    const foundEmail = DUMMY_USERS.find(user=>user.email===email)
    if(!foundEmail || foundEmail.password!==password) {
        throw new Error('Auth failed!',401)
    }
    res.status(200).json({message:'Login Successful!'})
}

exports.allUsers = allUsers
exports.getUserById = getUserById
exports.signUp = signUp
exports.login = login