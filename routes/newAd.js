const express = require('express');
const router = express.Router();
const controller = require("../controllers/newAd");

router.post('/create', controller.AdPost);
router.get('/create', controller.AdGet);

module.exports = router;