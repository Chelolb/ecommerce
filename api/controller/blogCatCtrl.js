const BCategory = require ('../models/blogCatModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

// create category
const createCategory = asyncHandler (async (req, res) => {
    try{
        const newCategory = await BCategory.create(req.body);
        res.json(newCategory);
    }
    catch(error){
        throw new Error(error);
    }
})

// update category
const updateCategory = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const updateCategory = await BCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateCategory);
    }
    catch(error){
        throw new Error(error);
    }
})

// delete category
const deleteCategory = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const deleteCategory = await BCategory.findByIdAndDelete(id);
        res.json(deleteCategory);
    }
    catch(error){
        throw new Error(error);
    }
})

// get category
const getCategory = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const getCategory = await BCategory.findById(id);
        res.json(getCategory);
    }
    catch(error){
        throw new Error(error);
    }
})

// get all category
const getallCategory = asyncHandler (async (req, res) => {
    try{
        const getallCategory = await BCategory.find();
        res.json(getallCategory);
    }
    catch(error){
        throw new Error(error);
    }
})

module.exports = { 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getCategory, 
    getallCategory 
};