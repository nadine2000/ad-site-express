const express = require('express');
const router = express.Router();
const controller = require("../controllers/login");

router.post('/log', controller.loginPost);
router.get('/log', controller.loginGet);

module.exports = router;
