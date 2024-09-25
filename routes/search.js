const express = require('express');
const router = express.Router();
const controller = require("../controllers/search");

router.get('/find', controller.searchGet);

module.exports = router;
