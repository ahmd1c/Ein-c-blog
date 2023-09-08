import React, { useRef, useState } from 'react'
import "./changepassword.css"
import { useDispatch } from 'react-redux';
import { logUserOut } from '../../../store/userReducer';
import {useNavigate} from "react-router-dom" 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ChangePassword() {
  const [showPass , setShowPass] = useState(false)
  const [currentPassword , setCurrentPassword] = useState("")
  const [newPassword , setNewPassword] = useState("")
  const [repeatNewPassword , setRepeatNewPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const handleChangePassword = async(e)=>{
    toast("please wait...")
    e.preventDefault();
    if( currentPassword.trim().length < 8 
        || newPassword.trim().length < 8 
        || repeatNewPassword !== newPassword ) return console.log("invalid passwords")

        try{

          const response = await fetch("http://localhost:5000/api/v1/user/changePassword" , {
            method: "PATCH",
            credentials:"include",
            headers: {
              "Content-Type" : "application/json"
            },
            body : JSON.stringify({
              currentPassword ,
              newPassword,
              repeatNewPassword
            })
          })
          const data = await response.json()
          if(data.state==="success"){ 
            dispatch(logUserOut());
            toast.success("password has been changed successfully")
            navigate('/signIn' , {replace : true})
          }else if(data.state==="failed"){ 
            toast.error("invalid passwords");
          }
        }catch(error){
          toast.error("something went wrong");
        
        }
  }

  return (
    <>
    <ToastContainer />
    <div className="change-password">
            <form onSubmit={handleChangePassword} >
              <div className="current-password">
                <label htmlFor="">current password</label>
                <input value={currentPassword} onChange={(e)=> setCurrentPassword(()=> e.target.value)} type={showPass ? "text" : "password"} name="" id="" />
              </div>
              <div className="new-password">
                <label htmlFor="">new password</label>
                <input  value={newPassword} onChange={(e)=> setNewPassword(()=> e.target.value)} type={showPass ? "text" : "password"} name="" id="" />
              </div>
              <div className="repeat-new-password">
                <label htmlFor="">repeat new password</label>
                <input value={repeatNewPassword} onChange={(e)=> setRepeatNewPassword(()=> e.target.value)} type={showPass ? "text" : "password"} name="" id="" />
              </div>
              <div className="user-settings-buttons">
                <button onClick={()=>setShowPass((prev)=> !prev)} type="button">show passwords</button>
                <button type="reset">reset</button>
                <button type="submit">save</button>
              </div>
            </form>
          </div>
          </>
  )
}

export default ChangePassword