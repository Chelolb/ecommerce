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
        uploadImages
} = require('../controller/blogCtrl');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');

router.post('/', authMiddlerware, isAdmin, createBlog);
router.put('/upload/:id', authMiddlerware, isAdmin, 
            uploadPhoto.array('images', 10), 
            blogImgResize,
            uploadImages);
router.put('/like', authMiddlerware, likeBlog);
router.put('/dislike', authMiddlerware, dislikeBlog);
router.put('/:id', authMiddlerware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlog);
router.delete('/:id', authMiddlerware, isAdmin, deleteBlog);


module.exports = router;