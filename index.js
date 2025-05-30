const express = require("express");
const cors= require('cors');
const jwt= require('jsonwebtoken');

const JWT_SECRET_KEY= require('./config');
const mainRouter= require('./routes/index');


const app= express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen('5000', ()=>{
    console.log("the server is running at 5000");
})

