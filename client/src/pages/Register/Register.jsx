import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Select from 'react-select';
import Spiner from "../../components/Spiner/Spiner"
import {ToastContainer, toast} from "react-toastify"
import { registerfunc } from "../../services/Apis";
import 'react-toastify/dist/ReactToastify.css';
import "./Register.css";
import { addData } from "../../components/context/ContextProvider";
const Register = () => {

    const [inputdata, setInputData] = useState({
        fname:"",
        lname:"",
        email:"",
        mobile:"",
        gender:"",
        location:""
    })

    const [status, setStatus] = useState("Active")
    const [image, setImage] = useState("")
    const [preview, setPreview] = useState("")

    
    const [showspin, setShowSpin] = useState(true)

    const navigate = useNavigate()

   const {useradd,setUseradd} = useContext(addData)

    //status options
    const options = [
        { value: 'Active', label: 'Active' },
        { value: 'InActive', label: 'InActive' },
      ];

    //setInput Value
    const setInputValue = (e)=>{
        const {name,value} = e.target;
        setInputData({...inputdata, [name]:value})
    }

    // status set
    const setStatusValue = (e)=>{
        setStatus(e.value)
    }

    //profile set
    const setProfile = (e)=>{
        setImage(e.target.files[0])
    }

    const submitUserData = async (e)=>{
        e.preventDefault();

        const {
            fname,
            lname,
            email,
            mobile,
            gender,
            location
        } = inputdata

        if(fname === ""){
            toast.error("First name is required !")
        }else if(lname === ""){
            toast.error("last name is required !")
        }else if(email === ""){
            toast.error("Email is required !")
        }else if(!email.includes("@")){
            toast.error("Enter Valid Email !")
        }else if(mobile === ""){
            toast.error("Mobile number is required !")
        }else if(mobile.length > 10){
            toast.error("Enter valid Mobile Number !")
        }else if(gender === ""){
            toast.error("Gender is required !")
        }else if(image === ""){
            toast.error("Profile is required !")
        }else if(location === ""){
            toast.error("location is required !")
        }else{
            
            const data = new FormData();
            data.append("fname",fname)
            data.append("lname",lname)
            data.append("email",email)
            data.append("mobile",mobile)
            data.append("gender",gender)
            data.append("status",status)
            data.append("user_profile",image)
            data.append("location",location)

        const config = {
            "Content-Type":"multipart/form-data"
        }

        const response = await registerfunc(data,config)
        if(response.status === 201){
            setInputData({
                ...inputdata,
                fname:"",
                lname:"",
                email:"",
                mobile:"",
                gender:"",
                location:""
            });
            setStatus("")
            setImage("")
            setUseradd(response.data)
            navigate("/")
        }else{
            toast.error("Error")
        }
        }
    }

    useEffect(()=>{
        if(image){
            setPreview(URL.createObjectURL(image))
        }
        setTimeout(()=>{
            setShowSpin(false)
        },1200)
    },[image])

    return (
        <>
        {
            showspin ? <Spiner/> : <div className="container">
            <h2 className="text-center mt-1">Register your Details</h2>
            <Card className="shadow mt-3 p-3">
                <div className="profile_div text-center">
                    <img src={preview ? preview : "/man.png"} alt="" />
                </div>
                <Form>
                    <Row>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                        <Form.Label>First name</Form.Label>
                        <Form.Control type="text" name="fname" value={inputdata.fname} onChange={setInputValue} placeholder="Enter your Name"/>
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control type="text" name="lname" value={inputdata.lname} onChange={setInputValue} placeholder="Enter Lastname"/>
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" value={inputdata.email} onChange={setInputValue} placeholder="Enter Email" />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                        <Form.Label>Mobile </Form.Label>
                        <Form.Control type="number" name="mobile" value={inputdata.mobile} onChange={setInputValue} placeholder="Enter Mobile number" />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                        <Form.Label>Select your Gender</Form.Label>
                            <Form.Check 
                                type={"radio"}
                                label={`Male`}
                                name="gender"
                                value={"Male"}
                                onChange={setInputValue}
                            />
                            <Form.Check 
                                type={"radio"}
                                label={`Female`}
                                name="gender"
                                value={"Female"}
                                onChange={setInputValue}
                            />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                        <Form.Label>Select your Status</Form.Label>
                        <Select
                            options={options} onChange={setStatusValue} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicPassword">
                        <Form.Label>Select Your Profile</Form.Label>
                        <Form.Control type="file" name="user_profile" onChange={setProfile} placeholder="Select Your Profile" />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="formBasicPassword">
                        <Form.Label>Select Your Location</Form.Label>
                        <Form.Control type="text" name="location" value={inputdata.location} onChange={setInputValue} placeholder="Select Your Location" />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={submitUserData}>
                        Submit
                    </Button>
                    </Row>
                </Form>
            </Card>
            <ToastContainer position="top-center"/>
        </div>
        }

        </>
    );
};

export default Register;
