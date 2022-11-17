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
    var {task,tasks} = req.body 
    var updated = req.user.assignedTasks 
    console.log(updated)
    User.findOneAndUpdate({_id:req.user._id},{$set : {assignedTasks:updated}},{new:true})
    .then(user=>{
        console.log('assigned')
        res.redirect('/dashboard/tasks')
    })
    // User.find({name: req.user.name},(err,user)=>{
    //     if (err) throw err;
        
    //     user.save()
    //     res.redirect('/dashboard')
    // })
})
router.get('/tasks',(req,res)=>{
    var tasks = req.user.assignedTasks
    var show = []
    tasks.forEach(element => {
        Task.findOne({_id: element},(err,user)=>{
            if (err)  throw err;
            if (user){
                    show.push(user)
                    res.render('dashboard/tasks',{
                        task: show,
                        user: req.user
                    })
                    console.log(show)
            }
        })
    });
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