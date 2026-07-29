const { Router } = require("express");
const multer = require("multer");
const Comment = require("../models/comment");
const Blog = require("../models/blog");

// 1. Require Cloudinary packages
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = Router();

// 2. Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. Replace diskStorage with CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_covers", // Creates a folder in your Cloudinary account
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
    return res.render("addBlog");
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogID: req.params.id }).populate("createdBy");
    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        // 4. THIS IS THE MAGIC LINE: req.file.path holds the Cloudinary https:// link
        coverImageURL: req.file.path 
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogID", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        createdBy: req.user._id,
        blogID: req.params.blogID,
    });

    return res.redirect(`/blog/${req.params.blogID}`);
});

module.exports = router;