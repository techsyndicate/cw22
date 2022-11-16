const router = require('express').Router()
const User = require('../models/userSchema')
const {ensureAuthenticated,forwardAuthenticated} = require('../config/auth')
const Task = require('../models/taskSchema')
router.get('/',ensureAuthenticated,(req,res)=>{
    user = req.user
    if (user.isBanned == true){
        return res.status(400).json({
            msg: 'Your access to the platform has been \'temporarily\' revoked. Please visit Kabir "The Executioner" Bhalla, he just wants to have a little chat.'
        })
    }
    const Tasks = Task.find({
        role: user.role,
        isDone: false
    },(err,tasks)=>{
        console.log(tasks)
        res.render('dashboard/index',{
            user,
            tasks
        })
    })
   
})
router.post('/assign/:id',(req,res)=>{
    let id = req.params.id
    var {task} = req.body 
    User.find({name: req.user.name},(err,user)=>{
        if (err) throw err;
        user.assignedTasks.concat([task])
        user.save()
        res.redirect('/dashboard')
    })
})
router.post('/location',  (req, res) => {
    const {currentPosition} = req.body
   User.findOneAndUpdate({_id: req.user._id},{$set:{location:[currentPosition[0],currentPosition[1]]}},{new:true})
    .then(user=>{
        console.log('location updated')
        res.redirect('/dashboard/')
    })
    .catch(err=>{
        console.log(err)
    })
});
router.get('/shop', ensureAuthenticated,(req,res)=>{
    res.render('dashboard/shop',{
        user: req.user
    })
})
router.get('/profile',ensureAuthenticated,(req,res)=>{
    res.render('dashboard/profile',{
        user: req.user
    })
})
module.exports = router