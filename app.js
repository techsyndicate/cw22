require('dotenv').config()

const express =require('express')
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const app = express()
app.listen(3000 || process.env.port,()=>{
    console.log('app run')
})