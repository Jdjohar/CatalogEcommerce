const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.get('/', categoryController.getAllCategories);
router.post('/', auth, categoryController.createCategory);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);
router.post('/reorder', auth, categoryController.reorderCategories);

module.exports = router;
