var express = require('express');
var router = express.Router();
var ApiController = require('../controller/ApiController');

/* GET home page. */


router.get('/v1/updateuser',ApiController.updateUser);
router.post('/v1/updateuser',ApiController.updateUser);

router.get('/v1/updatedevice',ApiController.updateDevice);
router.post('/v1/updatdevice',ApiController.updateDevice);

router.get('/v1/getdevice',ApiController.getDevice);
router.post('/v1/getdevice',ApiController.getDevice);


router.get('/v1/newdevice',ApiController.newDevice);
router.post('/v1/newdevice',ApiController.newDevice);

router.get('/v1/getdevice',ApiController.getDevice);
router.post('/v1/getdevice',ApiController.getDevice);

router.get('/v1/alldevice',ApiController.allDevice);
router.post('/v1/alldevice',ApiController.allDevice);

router.get('/v1/updatedevice',ApiController.updateDevice);
router.post('/v1/updatedevice',ApiController.updateDevice);

router.get('/v1/deletedevice',ApiController.deleteDevice);
router.post('/v1/deletedevice',ApiController.deleteDevice);

router.get('/v1/deviceruntime',ApiController.deviceRuntime);
router.post('/v1/deviceruntime',ApiController.deviceRuntime);

router.get('/v1/alldeviceruntime',ApiController.allDeviceRuntime);
router.post('/v1/alldeviceruntime',ApiController.allDeviceRuntime);

router.get('/v1/devicefconsumption',ApiController.deviceFConsumption);
router.post('/v1/devicefconsumption',ApiController.deviceFConsumption);

router.get('/v1/alldevicefconsumption',ApiController.allDeviceFConsumption);
router.post('/v1/alldevicefconsumption',ApiController.allDeviceFConsumption);

router.get('/v1/makesubscription',ApiController.makeSubscription);
router.post('/v1/makesubscription',ApiController.makeSubscription);

module.exports = router;
