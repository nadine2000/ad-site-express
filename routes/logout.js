const express = require('express');
const router = express.Router();
const controller = require("../controllers/logout");

router.post('/exit', controller.logoutPost);

module.exports = router;