const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

// Create Blog
const createBlog = asyncHandler (async (req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json({newBlog});
    }catch(error){
        throw new Error(error);
    }
});

// Update blog
const updateBlog = asyncHandler ( async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, 
            req.body, 
            {new: true,}
        )
        res.json(updateBlog);
    }catch(error){
        throw new Error(error);
    }
});

// get blog
const getBlog = asyncHandler ( async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes") ;
        const updateView = await Blog.findByIdAndUpdate(id,
            {$inc: {numView:1}, },
            {new: true,}
        );   
        res.json(getBlog);
    }catch(error){
        throw new Error(error);
    }
})

// Get All blog
const getAllBlog = asyncHandler ( async (req, res) => {
    try {
        const getallBlog = await Blog.find();
        res.json(getallBlog);
    }catch(error){
        throw new Error(error);
    }
});

// Delete blog
const deleteBlog = asyncHandler ( async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog);
    }catch(error){
        throw new Error(error);
    }
});

// Like a Blog
const likeBlog = asyncHandler ( async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find if user loged
    const loginUserId = req?.user?._id;
    // find if user has liked the blog
    const isLiked = blog?.isLiked;
    // find if user has disliked the blog
    const alreadyDisliked =  blog?.dislikes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if(alreadyDisliked){    
        const blog = await Blog.findByIdAndUpdate(blogId,
            { 
                $pull: {dislike:loginUserId},
                isDisliked: false,
            },
            { new: true},
        );
        res.json(blog);
    };
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,
            { 
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            { new: true},
        );
        res.json(blog);
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId,
            { 
                $push: {likes: loginUserId},
                isLiked: true,
            },
            { new: true},
        );
        res.json(blog);
    }
});

// Dislike a Blog
const dislikeBlog = asyncHandler ( async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find if user loged
    const loginUserId = req?.user?._id;
    // find if user has disliked the blog
    const isDisliked = blog?.isDisliked;
    // find if user has disliked the blog
    const alreadyLiked =  blog?.likes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if(alreadyLiked){    
        const blog = await Blog.findByIdAndUpdate(blogId,
            { 
                $pull: {likes:loginUserId},
                isLiked: false,
            },
            { new: true},
        );
        res.json(blog);
    };
    if(isDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,
            { 
                $pull: {dislikes: loginUserId},
                isDisliked: false,
            },
            { new: true},
        );
        res.json(blog);
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId,
            { 
                $push: {dislikes: loginUserId},
                isDisliked: true,
            },
            { new: true},
        );
        res.json(blog);
    }
});

module.exports = { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog };