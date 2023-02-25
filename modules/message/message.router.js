const router = require('express').Router();
const { auth } = require('../../middlewear/auth');
const { validation } = require('../../middlewear/validation');
const messageController = require('./controller/message.controller');
const messgeValidation = require('./message.validation')
router.post('/:reciverId',validation(messgeValidation.sendMessage),messageController.sendMessage);
router.get('/messages',auth(),messageController.messageList);
router.delete('/:id',auth(),messageController.deleteMessage);
module.exports=router;