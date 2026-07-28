const {Router}= require("express");
const User=require("../models/user");

const router=Router();

router.get('/signin',(req,res)=>{
    return res.render('signin');
});

router.get('/signup',(req,res)=>{
    return res.render('signup');
});

router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    console.log("Yes its fine")
    await User.create({
        fullName,
        email,
        password,
    });
    return res.render('home');
})

router.post('/signin',async(req,res)=>{
    try {
        const {email,password}=req.body;
        const token=await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error: "Incorrect Password or Username"
        });
    }
})

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
})

module.exports=router;