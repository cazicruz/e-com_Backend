const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser'); 
const WebHookController = require('../../controllers/webHooks');


// router.post('/paystack-hook',bodyParser.raw({ type: 'application/json' }),WebHookController.dvaHook);
router.post('/paystack-hook',bodyParser.raw({ type: 'application/json' }),WebHookController.transactionHook);
router.post('/paystack-transferValidationhook',bodyParser.raw({ type: 'application/json' }),WebHookController.transferApprovalHook);

module.exports=router;