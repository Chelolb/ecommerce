const express = require('express');
const router = express.Router();
const { isAdmin, authMiddlerware } = require('../middlewares/authMiddleware')
const { createProduct, 
    getaProduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct, 
    addToWishlist,
    rating
} = require('../controller/productCtrl');


router.post('/', authMiddlerware, isAdmin, createProduct);
router.get('/:id', getaProduct);
router.put('/wishlist', authMiddlerware, addToWishlist);
router.put('/rating', authMiddlerware, rating);
router.put('/:id', authMiddlerware, isAdmin, updateProduct);


router.delete('/:id', authMiddlerware, isAdmin, deleteProduct);
router.get('/', getAllProduct);


module.exports = router;