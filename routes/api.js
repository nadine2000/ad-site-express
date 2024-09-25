const express = require('express');
const router = express.Router();
const controller = require("../controllers/api");

router.put('/ads-approve/:id', controller.apiPut);
router.get('/ads', controller.apiGet);
router.delete('/ads/:id', controller.apiDelete);

module.exports = router;