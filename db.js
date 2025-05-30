const mongoose= require('mongoose');
const { Mongodb_URL } = require('./config');
require('dotenv').config();

mongoose.connect(process.env.Mongodb_URL).then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log("Could not able to connect", err);
});


const user= new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
         type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    }
});


const accountSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, //Reference to user model
        ref: 'User',
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
})


const User= mongoose.model("User", user);
const Account= mongoose.model("Account", accountSchema);


module.exports={
    User,
    Account
}

