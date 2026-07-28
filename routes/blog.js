const {Router}= require("express");
const multer = require("multer");
const Comment= require("../models/comment");
const path = require("path");
const Blog=require("../models/blog");

const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`)); 
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog");
})

router.get("/:id",async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({blogID:req.params.id}).populate("createdBy");
    return res.render("blog",{
        user: req.user,
        blog,
        comments,
    });
})

router.post("/",upload.single("coverImage"),async (req,res)=>{
    const {title,body}= req.body;
    const blog=await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.post("/comment/:blogID",async(req,res)=>{
    await Comment.create({
        content:req.body.content,
        createdBy:req.user._id,
        blogID:req.params.blogID,
    })

    return res.redirect(`/blog/${req.params.blogID}`);
});

module.exports=router;