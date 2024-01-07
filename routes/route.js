const express = require('express');
const router = express.Router();
const deploy = require('../smartContractInteract/sm-Co_deploy')
const interact = require('../smartContractInteract/sm-Co_intercat')

router.post('/deploy',deploy.deployContract);
router.post('/mint',interact.mintNewTokens);
router.post('/burn',interact.burnTokens);
router.post('/checkBalance',interact.checkBalance);
router.post('/airDrop',interact.airdrop);
router.post('/checkHistory',interact.checkHistory);
router.post('/transactionDetail',interact.transactionDetails);
router.post('/contractInfo',interact.contractInfo);


module.exports = router;