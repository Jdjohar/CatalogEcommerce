const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', sliderController.getAllSliders);
router.post('/', auth, upload.single('image'), sliderController.createSlider);
router.put('/:id', auth, upload.single('image'), sliderController.updateSlider);
router.delete('/:id', auth, sliderController.deleteSlider);
router.post('/reorder', auth, sliderController.reorderSliders);

module.exports = router;
