const router = require('express').Router()
const User = require('../models/userSchema')
const Task = require('../models/taskSchema')
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
router.get('/task',(req,res)=>{
    res.render('admin/task')
})
router.post('/task',(req,res)=>{
    var {
        title,
        reward,
        roles,
        exp,
        description
    } = req.body
    console.log(req.body)
    const newTask = new Task(
        {title,
        description,
        reward,
        exp,
        role:roles
    })
    newTask.save()
    res.redirect('/admin/view')
})
router.get('/view',(req,res)=>{
    Task.find({}).then(Tasks=>{
        res.render('admin/tasks', {
            task: Tasks
        })
    })
    
})
module.exports = router