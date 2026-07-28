require("dotenv").config();
const path=require("path");
const express=require("express");
const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");
const Blog=require("./models/blog");
const mongoose=require("mongoose");
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app=express();
const PORT=process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Started at ${PORT}`);
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error: ", err);
    });

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve('./public')));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.get("/", async (req,res)=>{
    const allBlogs=await Blog.find({});
    return res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT, ()=> console.log(`Server Started at ${PORT}`));



