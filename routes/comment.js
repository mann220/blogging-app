const {Router}= require("express");
const Comment=require("../models/comment");

const router=Router();

router.post("/comment/:blogID",async(req,res)=>{
    const comment=await Comment.create({
        content:req.body.content,
        createdBy:req.user._id,
        blogID:req.params.blogID,
    })

    return res.redirect(`/blog/${req.params.blogID}`);
});

module.exports=router;