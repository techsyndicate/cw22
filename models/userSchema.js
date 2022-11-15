const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = {
    type: String,
    required: true
}
const userSchema = new Schema({
    name: reqString,
    pin:{
        type: String,
        default: '65124' 
    },
    location: {
        type: Array,
        default: [0,0]
    }
},{
    timestamps: true
})

const User =  mongoose.model('userInfo', userSchema)
model.exports= User