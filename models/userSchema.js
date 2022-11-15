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
    },
    role: {
        type: String,
        default: 'Rookie'
    },
    location: {
        type: Array,
        default: [0,0]
    }
},{
    timestamps: true
})

const User =  mongoose.model('userInfo', userSchema)
module.exports= User