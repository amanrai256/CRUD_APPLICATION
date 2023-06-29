const User = require("../models/usersSchema")
const moment = require("moment")
const csv = require("fast-csv")
const fs = require("fs")

//Register post
const userpost = async(req,res)=>{
    // console.log(req.file)
    const file = req.file.filename;
    const {fname,lname,email,mobile,gender,location,status} = req.body

    if(!fname || !lname || !mobile || !email || !gender || !location || !status){
        res.status(401).json("All Inputs is required")
    }

    try {
        const preuser = await User.findOne({email:email});

        if(preuser){
            res.status(401).json("This user already exist in our database")
        }else{
            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
            const userData = new User({
                fname,lname,email,mobile,gender,location,status,profile:file,datecreated
            })

            await userData.save();
            res.status(201).json(userData);
        }
    } catch (error) {
        res.status(401).json(error)
        console.log("catch block errors")
    }
}

//userget
const userget = async(req,res)=>{

    const search = req.query.search || ""
    const gender = req.query.gender || ""
    const status = req.query.status || ""
    const sort = req.query.sort || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;

    const query = {
        fname : {$regex:search,$options:"i"}
    }

    if(gender !== "All"){
        query.gender = gender
    }

    if(status !== "All"){
        query.status = status
    }

    try {
        const skip = (page - 1) * ITEM_PER_PAGE  // 1 * 4 = 4

        const count = await User.countDocuments(query);

        const usersdata = await User.find(query)
            .sort({ datecreated: sort == "new" ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        const pageCount = Math.ceil(count/ITEM_PER_PAGE);  // 8 /4 = 2

        res.status(201).json({
            Pagination:{
                count,pageCount
            },
            usersdata
        })
    } catch (error) {
        res.status(401).json(error)
    }
}

//single user get

const singleuserget = async(req,res) => {

    const {id} = req.params;

    try {
        const userdata = await User.findOne({_id:id});
        res.status(201).json(userdata)
    } catch (error) {
        res.status(401).json(error)
    }
}

//user edit

const useredit = async(req,res)=>{
    const {id} = req.params;
    const {fname,lname,email,mobile,gender,location,status, user_profile} = req.body
    const file = req.file ? req.file.filename : user_profile

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    try {
        const updateuser = await User.findByIdAndUpdate({_id:id},{
            fname,lname,email,mobile,gender,location,status,profile:file,dateUpdated
        },
        {
            new:true
        })
        await updateuser.save()
        res.status(201).json(updateuser)
    } catch (error) {
        res.status(401).json(error)
    }
}


//delete user

const userdelete = async (req,res) => {
    const {id} = req.params;

    try {
        const deleteuser = await User.findByIdAndDelete({_id:id});
        res.status(201).json(deleteuser);
    } catch (error) {
        res.status(401).json(error)
    }
}

// change Status

const userstatus = async(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    try {
        const userstatusupdate = await User.findByIdAndUpdate({_id:id},{status:data},{new:true});
        res.status(201).json(userstatusupdate)
    } catch (error) {
        res.status(401).json(error)
    }
} 

//export user

const userExport = async(req,res)=>{
    try {
        const usersdata = await User.find();

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export/")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/");
            }
            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/users.csv"
        );

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `http://localhost:5000/files/export/users.csv`,
            });
        });
        if (usersdata.length > 0) {
            usersdata.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    LastName: user.lname ? user.lname : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                })
            })
        }
        csvStream.end();
        writablestream.end();

    } catch (error) {
        res.status(401).json(error)
    }
}

module.exports = {userpost, userget, singleuserget, useredit, userdelete, userstatus,userExport}

// `http://localhost:5000/files/export/users.csv`