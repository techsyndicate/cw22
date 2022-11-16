const router = require('express').Router()
const User = require('../models/userSchema')
router.get('/',(req,res)=>{
    const UserData = User.find({})
    res.render('admin/index',{
        map : process.env.MAP
    })
})

router.get('/user/fetch',(req,res)=>{
    User.find({}).then((users) => {
        res.json({users})
        console.log(users)
    }).catch((err) => console.log(err))
})
router.get('/userInfo/:id', (req,res)=>{
    User.findById(req.params.id).then(user=>{
        res.render('admin/user',{
            user
        })
    })
})
module.exports = router