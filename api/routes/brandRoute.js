const express = require('express');
const router = express.Router();
const { authMiddlerware, isAdmin } = require('../middlewares/authMiddleware');
const { createBrand,
        updateBrand,
        deleteBrand,
        getBrand,
        getallBrand
     } = require('../controller/brandCtrl');


router.post('/', authMiddlerware, isAdmin, createBrand);
router.put('/:id', authMiddlerware, isAdmin, updateBrand);
router.delete('/:id', authMiddlerware, isAdmin, deleteBrand);
router.get('/:id', getBrand);
router.get('/', getallBrand);

module.exports = router;