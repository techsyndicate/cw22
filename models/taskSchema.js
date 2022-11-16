const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = {
    type: String,
    required: true
}
const taskSchema = new Schema({
    title:reqString,
    description: reqString,
    reward:{
        type: Number,
        default: 100
    },
    exp:{
        type: Number,
        default: 10
    },
    role: {
        type: String,
        default: 'Rookie'
    }
},{
    timestamps: true
})

const Task =  mongoose.model('taskinfo', taskSchema)
module.exports= Task