const express = require('express');
const router = express.Router();
const controller = require("../controllers/admin");

router.get('/page', controller.getAdmin);

module.exports = router;

