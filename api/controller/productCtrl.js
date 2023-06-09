const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const fs = require('fs');
const validateMongodbId = require('../utils/validateMongodbId');
const cloudinaryUploadImg = require('../utils/couldinary')

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id,
            req.body, 
            {
                new:true,
            }
        );
        res.json(updateProduct);
    }catch(error){
        throw new Error(error);
    }
});

// Get a Product
const getaProduct = asyncHandler(async (req, res) => {
    const { id }= req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }catch(error){
        throw new Error(error);
    }
});

// Get All Product
const getAllProduct = asyncHandler(async (req, res) => {
    try{
        // Filtering    (gte, gt, lte, lt) <field>[gte]=<Number> Ej: ...?price[lte]=1500 
        const queryObj = {... req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(`query= ${JSON.stringify(queryObj)}`);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // Sorting   ('' > up, '-' > down)  Ej:  ...sort=category.-price
        if(req.query.sort) {
            const sortBy = req.query.sort.split('.').join(' ');
            query = query.sort(sortBy);
        }else{  // by default
            query = query.sort('-createdAt');
        }

        // Limiting the field   (Ej: ?fields=<-><field1>,<-><field2>)   <-> (minus) --> excluded
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');        
            query = query.select(fields);
        }else{  // by default
            query = query.select('-__v');
        }

        // Pagination           Ej: ....?page=1&limit=3  (page->> Nº page,  limit->> quantity/page)
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This page does not exists")
        }
        console.log(page, limit, skip)

        const product = await query;
        res.json(product);
    }catch(error){
        throw new Error(error);
    }
})

// Delete a Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try{
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    }catch(error){
        throw new Error(error);
    }
});

// Add to whishlist
const addToWishlist = asyncHandler ( async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try{
        const user = await User.findById(_id);
        const allreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if(allreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                  $pull: { wishlist: prodId },
                },
                {
                  new: true,
                }
              );
              res.json(user);
        }
        else{
            let user = await User.findByIdAndUpdate(
                _id,
                {
                  $push: { wishlist: prodId },
                },
                {
                  new: true,
                }
              );
              res.json(user);
        }
    }
    catch (error){
        throw new Error (error);
    }
});

// calculate the product's rating
const rating = asyncHandler ( async (req, res) => {
    const {_id } = req.user;
    const { star, prodId, comment } = req.body;
    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedBy.toString() === _id.toString()
        );
        if(alreadyRated){
            const updateRating = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated },
            },
            {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment },
            },
            {
                new: true,
            }
            );
        }
        else{
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            postedBy: _id,
                            comment: comment,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }

        const getallrating = await Product.findById(prodId);
        let totalRating = getallrating.ratings.length;
        let ratingsum = getallrating.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum/totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId, 
            { 
                totalrating: actualRating,
            }, 
            { new: true }
        )
        res.json(finalproduct);
    }
    catch (error){
        throw new Error(error);
    }
});

// Charge product's images
const uploadImages = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    console.log(req.files)
    try{
        const uploader = (path) => cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newpath = await uploader (path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }

        const findProduct = await Product.findByIdAndUpdate(
            id, 
            {
                images: urls.map((file) => {
                    return file;
                }),   
            },
            {
                new: true,
            }
        );
        res.json(findProduct);
    }
    catch(error){
        throw new Error(error);
    }
})


module.exports = {
    createProduct, 
    getaProduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
};