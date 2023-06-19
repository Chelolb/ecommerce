const express = require('express');
const router = express.Router();
const { authMiddlerware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory,
        updateCategory,
        deleteCategory,
        getCategory,
        getallCategory
     } = require('../controller/prodcategoryCtrl');


router.post('/', authMiddlerware, isAdmin, createCategory);
router.put('/:id', authMiddlerware, isAdmin, updateCategory);
router.delete('/:id', authMiddlerware, isAdmin, deleteCategory);
router.get('/:id', getCategory);
router.get('/', getallCategory);

module.exports = router;