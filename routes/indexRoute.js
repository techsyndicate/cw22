const router = require('express').Router()
const User = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth')

router.get('/',(req,res)=>{
    questions = [
        ['Jimmy and I could never be made because we had' ,'irish blood'],
        ['Great men are not born great, they', 'grow great'],
        ['You shoot me in a dream. you better wake up and','apologise'],
        ['I work hard for this, i want you to', 'know that']
    ]   
    res.render('index',{
        ques: questions[Math.floor(Math.random() * 2) + 1],
        timer: 3
    })
})
router.post('/crack',(req,res)=>{
    var {
        ans
    } = req.body
    console.log(req.body)
    switch (ans) {
        case 'irish blood':
        case 'grow great':
        case 'apologise':
        case 'know that':
            res.redirect('/main')
            break;
        case 'kabirbhalla':
        case 'ishandas':
            res.redirect('/admin')
            break;
        default:
            res.redirect('/')
            break;
    }
})
router.get('/main',(req,res)=>{
    res.render('main')
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/register', async(req,res)=>{
    res.render('register')
})
router.post('/register',(req,res)=>{
    const {
        name, 
        password,
        password2,
        roles
    } = req.body
    console.log(req.body)
    let errors = []
    if (password.length < 6) {
        errors.push({msg: 'Password must be at least 6 characters'})
    }
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }
    var specialChars = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    var number = /^[0-9]*$/
    if (name.length < 3) {
        errors.push({msg: 'codename must be at least 3 characters'})
    }
    if (name.match(specialChars) || name.match(number)) {
        errors.push({msg: 'codename cannot contain special characters or numbers'})
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            password,
            role: roles,
            password2,
        })
    } else {
        User.findOne({name:name})
        .then((user)=>{
            if(user){
                errors.push({msg: 'Codename already exists'})
                res.render('register', {
                    errors,
                    name,
                    password,
                    password2,
                    role: roles,
                })
            }
            else{
                const newUser = new User({
                    name,
                    password,
                    role: roles
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        newUser.password = hash
                        newUser.save()
                        .then(user => {
                            console.log('User saved')
                            res.redirect('/login')
                        })
                        .catch(err => console.log(err))
                    })
                })
            }
        })


    }
})
router.post('/login',  (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })(req,res,next)
})
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login');
})
module.exports = router
