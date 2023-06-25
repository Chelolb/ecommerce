const express = require('express');
const router = express.Router();

const { createProduct, 
    getaProduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct, 
    addToWishlist,
    rating,
    uploadImages
} = require('../controller/productCtrl');
const { isAdmin, authMiddlerware } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');


router.post('/', authMiddlerware, isAdmin, createProduct);
router.get('/:id', getaProduct);
router.put('/wishlist', authMiddlerware, addToWishlist);
router.put('/rating', authMiddlerware, rating);
router.put('/:id', authMiddlerware, isAdmin, updateProduct);

router.put('/upload/:id', authMiddlerware, isAdmin, 
            uploadPhoto.array('images', 10), 
            productImgResize,
            uploadImages);
router.delete('/:id', authMiddlerware, isAdmin, deleteProduct);
router.get('/', getAllProduct);


module.exports = router;