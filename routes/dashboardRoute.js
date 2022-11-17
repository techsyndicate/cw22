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
    Task.find({
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
router.get('/assign/:id',(req,res)=>{
    let id = req.params.id
    let tasks = req.user.assignedTasks
    if (tasks.length > 0){
        tasks.push(id)
        User.findOneAndUpdate({_id: req.user._id},{$set:{
            assignedTasks: tasks
        }},{new:true})
        .then(()=>{
            res.redirect('/dashboard/tasks')
        })
    }
    else{
        tasks = [id]
        User.findOneAndUpdate({_id: req.user._id},{$set:{
            assignedTasks: tasks
        }},{new:true})
        .then(()=>{
            res.redirect('/dashboard/tasks')
        })
    }
})
router.get('/tasks', ensureAuthenticated, async(req,res)=>{
    var tasks = req.user.assignedTasks
    
    if(tasks.length > 0){
        var b = []

        for(let i =0; i<tasks.length; i++){
            let task = await Task.findById(tasks[i])
            console.log(task)
            b.push(task)
        }
        
        setTimeout(async ()=>{
            console.log(b)
            res.render('dashboard/tasks',{
                task: b
            })
        }, 500)

    }else{
        res.render('dashboard/tasks',{
            msg: 'No jobs taken'
        })
    }
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
router.post('/user/done',(req,res)=>{
    var {
        reward,
        exp,
        id
    } = req.body 
    
    let updatedReward =parseInt(reward) + parseInt(req.user.reward)
    let updatedExp = parseInt(req.user.exp) + parseInt(exp)
    User.findOneAndUpdate({
        _id : req.user.id
    },{
        $set:{
            reward: updatedReward,
            exp: updatedExp,
            assignedTasks: req.user.assignedTasks.splice(req.user.assignedTasks.indexOf(id))
        }
    },{
        new: true
    }).then(
        Task.findOneAndUpdate({
            _id: id
        },{
            $set:{
                isDone: true
            }
        },{new:true}).then(
            ()=>{
                res.redirect('/dashboard/shop')
            }
        )
        
    )
})
module.exports = router