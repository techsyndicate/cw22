const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = {
    type: String,
    required: true
}
const userSchema = new Schema({
    name: reqString,
    password: reqString,
    isBanned: {
        type: Boolean,
        default: false
    },
    reward : {
        type: Number,
        default: 100
    },
    exp: {
        type: Number,
        default: 10
    },
    role: {
        type: String,
        default: 'rookie'
    },
    location: {
        type: Array,
        default: [0,0]
    },
    assignedTasks:{
        type:Array,
        default: []
    }
},{
    timestamps: true
})

const User =  mongoose.model('userInfo', userSchema)
module.exports= User