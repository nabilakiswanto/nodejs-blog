const express= require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

//! AUTH MIDDLEWARE
const authMiddleware = (req, res, next)=> {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({message: 'Unauthorized'})
        // or return a unauthorized page
    };
    

    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({message:'Unauthorized'});
    }
}

//! Admin - login
router.get('/admin',async(req,res)=>{
    
    try{
        const locals ={
            title:"Admin",
            description:"lorem ipsum",
        }
        // const data = await Post.find()
        res.render('admin/index',{locals, layout:adminLayout});
    }catch(error){
        console.log(error);
    }

});

//! Admin Post check login
router.post('/admin',async(req,res)=>{
    
    try{
        const locals ={
            title:"Dashboard",
            description:"lorem ipsum",
        }
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'invalid credentials'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'invalid credentials'});
        }
        const token = jwt.sign({userId: user._id},jwtSecret);
        res.cookie('token', token, {httpOnly:true});

        res.redirect('/dashboard', {locals});
        
    }catch(error){
        console.log(error);
    }

});

//! admin dashboard
    router.get('/dashboard',authMiddleware, async (req,res)=>{
        try {
            const locals ={
                title:"Dashboard",
                description:"lorem ipsum",
            }
            const data = await Post.find();
            res.render('admin/dashboard', {
                locals, data, layout:adminLayout
            });
        } catch (error) {
            
        }

        
    });

//! create new articles page
    router.get('/add-post',authMiddleware, async (req,res)=>{
        try {
            const locals ={
                title:"Add Articles",
                description:"lorem ipsum",
            }
            const data = await Post.find();
            res.render('admin/add-post', {
                locals, layout:adminLayout
            });
        } catch (error) {
            
        }

        
    });

//! create new article post POST
    router.post('/add-post',authMiddleware, async (req,res)=>{
        try {
            try {
                const newPost = new Post({
                    title:req.body.title,
                    body:req.body.body
                });
                await Post.create(newPost);
                res.redirect('/dashboard');
            } catch (error) {
                console.log(error);
            }
            
        } catch (error) {
            console.log(error);
        }

        
    });
//! edit articles page
router.get('/edit-post/:id',authMiddleware, async (req,res)=>{
    try {
        const locals ={
            title:"Edit Articles",
            description:"lorem ipsum",
        }
        const data = await Post.findById({_id:req.params.id});

        res.render('admin/edit-post', {data, layout:adminLayout,locals})
    } catch (error) {
        console.log(error);
    }

    
});

//! edit articles page PUT
router.put('/edit-post/:id',authMiddleware, async (req,res)=>{
    try {
        await Post.findByIdAndUpdate(req.params.id,{
            title : req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }

    
});

//! admin delete article DELETE
router.delete('/delete-post/:id',authMiddleware, async (req,res)=>{
    try {
        await Post.deleteOne({_id:req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
    
});


//! admin logout
router.get('/logout', async (req,res)=>{
    res.clearCookie('token');
    // res.json({message:'logout successful'});
    res.redirect('/');
});


//? Admin register user
router.post('/register',async(req,res)=>{
    
    try{
        const {username,password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({username,password: hashPassword});
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message:'user already in use'});
            }
            res.status(500).json({message:'internal server error'});
        }
        
    }catch(error){
        console.log(error);
    }

});

module.exports = router;