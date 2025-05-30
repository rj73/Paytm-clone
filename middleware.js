const {JWT_SECRET_KEY} = require('./config');
const jwt=require('jsonwebtoken');
require("dotenv").config();

const authMiddleware= (req,res, next)=>{
    const authHeader= req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(decoded.userId){
            req.userId= decoded.userId;

        next();
        }
        else{
                    res.status(403).json({});

        }
    }catch(err){
        res.status(403).json({});
    }

};

module.exports={
    authMiddleware
}