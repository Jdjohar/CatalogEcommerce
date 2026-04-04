const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', settingsController.getSettings);
router.put('/', auth, upload.single('logo'), settingsController.updateSettings);

module.exports = router;
