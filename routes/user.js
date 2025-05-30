const express= require('express');
const zod= require('zod');
const { User, Account } = require('../db');
const jwt= require('jsonwebtoken');
const { authMiddleware } = require('../middleware');
require("dotenv").config();

const userRouter= express.Router();


const singUpSchema= zod.object({
    userName: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

const signInSchema= zod.object({
    userName: zod.string(),
    password: zod.string()
})


const updateSchema= zod.object({
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string()
})

userRouter.post('/signup', async(req,res)=>{
    const body= req.body;
    const {success}= singUpSchema.safeParse(req.body);
    if(!success){
        return res.json({
            msg: "Invalid input"
        })
    }

    const user= User.findOne({
        username: body.userName
    })

    if(user._id){
         return res.json({
            msg: "Username already taken"
        })
    }

   const dbUser= await User.create(body);


   const acount = await Account.create({
    userId: dbUser._id,
    balance: 1 + Math.random() *10000
   })

    const token= jwt.sign({
        userId: dbUser._id
    }, process.env.JWT_SECRET_KEY);


  
    res.json({
        msg: "User created succefully",
        token: token
    });

})

userRouter.get("/current", authMiddleware, async(req,res)=>{
    const userId= req.userId;

    if(userId){
        const user=await User.findById({_id: userId});
        if(user){
            return res.status(200).json(user);
        }
        return res.send("No user found");
    }
    return res.send("Invalid token");

})


userRouter.get('/bulk', async(req, res)=>{
        const filter= req.query.filter || "";

        const users= await User.find({
            $or:[{
                firstName:{
                    "$regex": filter 
                }
            },{
                lastName:{
                    "$regex": filter
                }
            }]
        })

        res.json({
            user: users.map((user)=>({
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
})
})

userRouter.post('/signin', async(req,res)=>{
    const body= req.body;

    const {success}= signInSchema.safeParse(body);
    if(!success){
        res.json({
            msg: "Invalid input"
        })
    }

    const user=await User.findOne({
        userName: body.userName,
        password: body.password
    })

    if(user._id){
        const token= jwt.sign({ userId: user._id}, process.env.JWT_SECRET_KEY);
       return  res.status(200).json({
            token
        })
    };
    
    return res.status(411).json({
        msg: "Error while loging in"
    });
})

userRouter.put('/update', authMiddleware, async(req,res)=>{
    const body= req.body;
    const {success} = updateSchema.safeParse(body);

    if(!success){
        return res.json({
            msg: "Invalid inputs"
        })
    }
    console.log(success)

    await User.updateOne({_id: req.userId}, body);
    res.json({
        msg: "User updated succesfully"
    })
})

module.exports= userRouter;