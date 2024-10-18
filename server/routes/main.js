const express= require('express');
const router = express.Router();
const Post = require('../models/Post');

//routes
//!get /home
router.get('',async(req,res)=>{
    try{
        const locals ={
            title:"nodejs blog",
            description:"lorem ipsum",
        }
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <=Math.ceil(count/perPage);
        
        res.render('index',{locals,data,currentRoute:'/',current: page, nextPage: hasNextPage ? nextPage : null});
    }catch(error){
        console.log(error);
    }

    
});

//! Post :id details
router.get('/post/:id',async(req,res)=>{

    try{
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals ={
            title:data.title,
            description:"lorem ipsum",
        }
        res.render('post',{locals,data,currentRoute:'/'});
    }catch(error){
        console.log(error);
    }
});

//! Post - search function
router.post('/search',async(req,res)=>{ 
    try{
        const locals ={
            title:"Search Articles",
            description:"lorem ipsum",
        }
        let searchTerm = req.body.searchTerm;
        console.log(searchTerm)
        const searchNoSpecialChar = searchTerm.replace(/[a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or:[
                {title:{$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body:{$regex: new RegExp(searchNoSpecialChar, 'i')}}
            
            ]
        });
        res.render('search',{locals,data,currentRoute: '/'});
    }catch(error){
        console.log(error);
    }

});

// ? wo pagination
// router.get('',async(req,res)=>{
//     const locals ={
//         title:"nodejs blog",
//         description:"lorem ipsum",
//     }
//     try{
//         const data = await Post.find()
//         res.render('index',{locals,data});
//     }catch(error){
//         console.log(error);
//     }

// });



router.get('/about',(req,res)=>{
    res.render('about',{currentRoute:'/about'});
});

// Function to insert post data if it doesn't exist
// async function insertPostData() {
//     try {
//         const existingPosts = await Post.countDocuments();
//         if (existingPosts === 0) {
//             await Post.insertMany([
//                 { title: "Lorem ipsum", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
//                 { title: "Building APIs with Node.js", body: "Learn how to use Node.js to build RESTful APIs..." },
//                 { title: "Deployment of Node.js applications", body: "Understand the different ways to deploy..." },
//                 { title: "Authentication and Authorization in Node.js", body: "Learn how to add authentication..." },
//                 { title: "MongoDB and Mongoose", body: "Understand how to work with MongoDB and Mongoose..." },
//                 { title: "Real-time apps with Socket.io", body: "Use Socket.io to build real-time, event-driven applications..." },
//                 { title: "Express.js framework", body: "Discover how to use Express.js to build web applications..." },
//                 { title: "Asynchronous Programming in Node.js", body: "Explore the asynchronous nature of Node.js..." },
//                 { title: "Node.js Basics and Architecture", body: "Learn the basics of Node.js and its architecture..." },
//                 { title: "Limiting Network Traffic in Node.js", body: "Learn how to limit network traffic..." },
//                 { title: "Using Morgan for HTTP Logging", body: "Learn how to use Morgan for HTTP request logging..." }
//             ]);
//             console.log('Sample posts inserted.');
//         } else {
//             console.log('Sample posts already exist, skipping insertion.');
//         }
//     } catch (error) {
//         console.error('Error inserting posts:', error);
//     }
// }

// Insert posts only once
// insertPostData();



module.exports = router;