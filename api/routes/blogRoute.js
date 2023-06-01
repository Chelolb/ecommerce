const express = require('express');
const { authMiddlerware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const { createBlog, 
        updateBlog, 
        getBlog,
        getAllBlog,
        deleteBlog,
        likeBlog,
        dislikeBlog,
} = require('../controller/blogCtrl');

router.post('/', authMiddlerware, isAdmin, createBlog);
router.put('/like', authMiddlerware, likeBlog);
router.put('/dislike', authMiddlerware, dislikeBlog);
router.put('/:id', authMiddlerware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlog);
router.delete('/:id', authMiddlerware, isAdmin, deleteBlog);


module.exports = router;