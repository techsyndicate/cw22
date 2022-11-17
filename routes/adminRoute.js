const router = require('express').Router()
const User = require('../models/userSchema')
const Task = require('../models/taskSchema')
router.get('/',(req,res)=>{
    const UserData = User.find({isBanned:false}).then(user=>{
        res.render('admin/index',{
            user
        })
    })
})

router.get('/userInfo/:id', (req,res)=>{
    let id = req.params.id
    User.findById(id).then(user=>{
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
    Task.find({isDone: false}).then(Tasks=>{
        res.render('admin/tasks', {
            task: Tasks
        })
    })
})
router.post('/del', async(req,res)=>{
    var {
        id 
    } = req.body
    Task.findOne({_id: id},(err,task)=>{
        if (err) throw err;
        task.remove()
        res.redirect('/admin/view')
    })
})
router.post('/done',async(req,res)=>{
    var {
        id 
    } = req.body
    Task.findOne({_id: id},(err,task)=>{
        if (err) throw err;
        task.isDone = true
        task.save()
        res.redirect('/admin/view')
    })
})
router.post('/user/ban', async(req,res)=>{
    var {
        id
    } = req.body
    User.findOne({_id: id},(err,task)=>{
        if (err) throw err;
        user.isBanned = true;
        user.save()
        res.redirect('/admin/view')
    })
})
router.post('/user/update',async(req,res)=>{
    var {
        name,
        roles,
        reward,
        exp
    } = req.body
    User.findOne({name: name},(err,user)=>{
        if (err) throw err;
        user.name = name
        user.role = roles
        user.reward = reward 
        user.exp = exp 
        user.save()
        res.redirect('/admin/userInfo/'+user.id)
    })
})
module.exports = router