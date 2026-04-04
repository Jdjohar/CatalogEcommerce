const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const posterController = require('../controllers/posterController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
router.post('/', auth, upload.array('images', 5), productController.createProduct);
router.put('/:id', auth, upload.array('images', 5), productController.updateProduct);
router.delete('/:id/images/:public_id', auth, productController.deleteProductImage);
router.delete('/:id', auth, productController.deleteProduct);
router.post('/bulk-delete', auth, productController.bulkDeleteProducts);

// Experimental Demo Feature
router.post('/:id/generate-poster', auth, posterController.generatePoster);

module.exports = router;
