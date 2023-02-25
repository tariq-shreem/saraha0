const { auth } = require('../../middlewear/auth');
const { myMulter, HME, multerValidation } = require('../../services/multer');

const userController = require('./controller/user.controller');
const router = require('express').Router();
router.patch('/updatePassword',auth(),userController.updatePassword);
router.patch('/profile/pic',auth(),myMulter(multerValidation.image).single('image'),HME,userController.uploadProfilePic);

module.exports=router;