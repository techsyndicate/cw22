require('dotenv').config()

const express =require('express')
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const app = express()
app.set("view engine", "ejs");
app.use(cookieparser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));

const indexRouter = require('./routes/indexRoute'),
      dashboardRouter = require('./routes/dashboardRoute')

app.use('/', indexRouter)
app.use('/dashboard', dashboardRouter)


app.listen(3000 || process.env.port,()=>{
    console.log('app run')
})