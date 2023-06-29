require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 5000;
const dbConnect = require("./db/conn")
const router = require("./Routes/router")

dbConnect()
app.use(cors())
app.use(express.json())
app.use(router)
app.use("/uploads", express.static("./uploads"));
app.use("/files",express.static("./public/files"));

app.get("/",(req,res)=>{
    res.status(201).json("server start")
})

app.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT}`)
})