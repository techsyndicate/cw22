const router = require('express').Router()
const User = require('../models/userSchema')
const {ensureAuthenticated,forwardAuthenticated} = require('../config/auth')

router.get('/',ensureAuthenticated,(req,res)=>{
    user = req.user
    if (user.isBanned == true){
        return res.status(400).json({
            msg: 'You were banned'
        })
    }
    res.render('dashboard/index',{
        user
    })
})
router.post('/location',  (req, res) => {
    const {currentPosition} = req.body
   User.findOneAndUpdate({_id: req.user._id},{$set:{location:[currentPosition[0],currentPosition[1]]}},{new:true})
    .then(user=>{
        console.log('location updated')
        res.redirect('/dashboard')
    })
    .catch(err=>{
        console.log(err)
    })
});

module.exports = router