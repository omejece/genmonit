var express = require('express');
var router = express.Router();
var ApiController = require('../controller/ApiController');

/* GET users listing. */
router.get('/api/v1/login',ApiController.apiLogin);
router.post('/api/v1/login',ApiController.apiLogin);

router.get('/api/v1/newuser',ApiController.newUser);
router.post('/api/v1/newuser',ApiController.newUser);

router.get('/api/v1/sendcode',ApiController.sendCode);
router.post('/api/v1/sendcode',ApiController.sendCode);



module.exports = router;
