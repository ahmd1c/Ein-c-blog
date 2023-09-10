import React, { useEffect, useRef, useState } from 'react'
import "./deleteAccount.css"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function DeleteAccount() {


    const deleteUserRef = useRef(null)
    const [sure , setSure] = useState("")
    const navigate = useNavigate()
    const handleDeleteAccountSubmit = (e)=>{
        toast("please wait...")
        e.preventDefault();
        if(sure.trim().toLowerCase()==="sure"){
            fetch("http://localhost:5000/api/v1/user/deleteAccount" , {
                method : "DELETE",
                credentials : "include"
            }).then(res => res.json()).then(data => {
                if(data.state === "success"){
                    toast.success("account has been deleted")
                    navigate("/")
                }else{
                    toast.error("failed")
                }
            }).catch(err =>{
                toast.error("something went wrong")
            })
        } 
        
    }
    


  return (
    <>
    <ToastContainer />
    <form onSubmit={handleDeleteAccountSubmit} className='delete-account-cont'>
        <h5>Do You Want To Delete Your Account ?</h5>
        <p>Type <span>"Sure"</span> in the field below then click the button</p>
        <input ref={deleteUserRef} onChange={(e)=>{
            setSure((prev)=> e.target.value)
        }} minLength={4} required maxLength={4} type="text" name="" id="" />
        <button className="delete-account-button" type="submit">Delete Account</button>
    </form>
    </>
        
  )
}

export default DeleteAccount