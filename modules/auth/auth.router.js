const router = require('express').Router();
const { validation } = require('../../middlewear/validation');
const authController = require('./controller/auth.controller');
const authValidation = require('./auth.validation')


router.post('/signup',validation(authValidation.signup),authController.signup);
router.get('/confirmEmail/:token',authController.confirmEmail);
router.get('/rftoken/:token',authController.refreshtoken);

router.get('/signin',validation(authValidation.signin),authController.signin)
router.get('/sendCode',authController.sendCode)
router.get('/forgetPassword',authController.forgetPassword);

router.get('/qrcode_allUsers',authController.qrcodeAllUser);
router.get('/getAllUsers',authController.getAllUsers)
module.exports=router;