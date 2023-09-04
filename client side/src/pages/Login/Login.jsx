import React, { useState } from "react";
import {useNavigate} from "react-router-dom" 
import "./login.css"
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userReducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  
  const handleLoginInSubmit = async(e)=>{
    e.preventDefault();
    toast("please wait...")
    if(email.trim() === "" || password.trim()==="" ) return
    try{

      const response = await fetch("http://localhost:5000/api/v1/user/signIn" , {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          email : email,
          password : password
        })
      })
      
      const data = await response.json()
      
      if(data.state==="success"){ 
        dispatch(setUser(data.data));
        toast.success("You are Successfully loged in")
        navigate('/' , {replace : true})
      }else if(data.state==="failed"){ 
        toast.error("invalid email or password")
      }
    }catch(error){
        toast.error("Something went wrong , Please try again")
    }
  }
  
  return (
    <>
    <ToastContainer />
    <div className="login-cont">
      <div className="login-box">
        <form onSubmit={handleLoginInSubmit}>
          <div className="user-box">
            <input id="login-email" type="email" 
            placeholder="email" 
            value={email} 
            onChange={(e)=>{
              console.log(email);
              setEmail(e.target.value)}} 
            name="email" 
            required />
            <label htmlFor="login-email">Email</label>
          </div>
          <br />
          <div className="user-box">
            <input id="login-password" placeholder="password" type="password" name="password" value={password} onChange={(e)=>{
              console.log(password);
              setPassword(e.target.value)}} required />
            <label htmlFor="login-password">Password</label>
          </div>
          <a href="http://localhost:5000/api/v1/user/resetPassword">Forgot Password?</a>
          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default Login;
