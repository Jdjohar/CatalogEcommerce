const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const auth = require('../middleware/auth');

router.get('/', subcategoryController.getAllSubcategories);
router.get('/category/:categoryId', subcategoryController.getSubcategoriesByCategory);
router.post('/', auth, subcategoryController.createSubcategory);
router.put('/:id', auth, subcategoryController.updateSubcategory);
router.delete('/:id', auth, subcategoryController.deleteSubcategory);

module.exports = router;
