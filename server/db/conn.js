const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const DB = process.env.DATABASE
const dbConnect = async()=>{
    try {
        const conn = await mongoose.connect(DB)
        console.log("database connected")
    } catch (error) {
        console.log("Database is not Connected")
        console.log(error)
    }
}

module.exports = dbConnect