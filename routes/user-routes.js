const express = require('express');

const { check } = require('express-validator');

const router = express.Router();

const userControllers = require('../controllers/user-controller');

const fileUpload = require('../middleware/file-upload')

router.get('/', userControllers.allUsers);
router.get('/:userId', userControllers.getUserById);
router.post(
  '/sign-up',
  fileUpload.single('image'),
  [
    check('name').isLength({ min: 3 }),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('address').not().isEmpty(),
  ],
  userControllers.signUp
);
router.post('/login', userControllers.login);

module.exports = router;
