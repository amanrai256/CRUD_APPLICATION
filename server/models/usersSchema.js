const mongoose = require("mongoose")
const usersSchema = new mongoose.Schema({
    fname : {
        type:String,
        required:true,
        trim:true
    },
    lname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile : {
        type: Number,
        required: true,
        unique: true,
        minlength:10,
        maxlength:10
    },
    gender : {
        type: String,
        required: true,
    },
    status : {
        type: String,
        required: true,
    },
    profile : {
        type: String,
        required: true,
    }, 
    location : {
        type: String,
        required: true,
    },
    datecreated:Date,
    dateUpdated:Date
});


const User = new mongoose.model("User", usersSchema);
module.exports = User;