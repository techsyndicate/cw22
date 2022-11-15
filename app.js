require('dotenv').config()

const express =require('express')
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const expressSessions = require('express-session')
const app = express()

const passport = require('passport');
require('./config/passport')(passport)

const db = process.env.db
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('connected to mongoDB')
})
.catch(err=>console.log(err))

app.set("view engine", "ejs");
app.use(cookieparser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(expressSessions({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
const indexRouter = require('./routes/indexRoute'),
      dashboardRouter = require('./routes/dashboardRoute')
      adminRouter = require('./routes/adminRoute')

app.use('/', indexRouter)
app.use('/dashboard', dashboardRouter)
app.use('/admin', adminRouter)

app.listen(3000 || process.env.port,()=>{
    console.log('app run')
})