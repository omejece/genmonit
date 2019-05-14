var express = require('express');
var router = express.Router();
var SiteController = require('../controller/siteController');

/* GET home page. */
router.get('/',SiteController.index);

module.exports = router;
