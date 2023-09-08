import React, { useRef, useState } from "react";
import "./userinfo.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../store/userReducer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserInfo() {
  const fileRef = useRef(null);
  const formRef = useRef(null)
  const [imageUrl , setImageUrl] = useState("")

  const [userData , setUserData] = useState({
    name : "",
    email : "",
    profilePhoto : "",
    bio : ""
  })

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const handleUpdateSubmit = (e) => {
    toast("please wait...")
    e.preventDefault();

    if (
      userData.name.trim() === "" &&
      userData.email.trim() === "" &&
      userData.bio.trim() === "" &&
      userData.profilePhoto.trim() === ""
    ) return toast.error("no fields to update");
    

    const formData = new FormData();
    userData.profilePhoto.trim() !== ""  &&   formData.append("image", userData.profilePhoto);
    userData.bio.trim() !== "" &&  formData.append("name", userData.name);
    userData.bio.trim() !== "" &&  formData.append("bio", userData.bio);
    fetch("http://localhost:5000/api/v1/user/updateProfile" , {
      method : "PUT",
      headers : {
        'Content/Type' : 'application/json'
      },
      credentials : "include",
      body : formData
      
    }).then(res => res.json()).then(data => {setUserData(data.data); dispatch(setUser(data.data)); toast.success("info has been updated successfully")
    }).catch(err => toast.error("something went wrong"))

  };

  return (
    <>
    <ToastContainer />
    <form  ref={formRef} onSubmit={handleUpdateSubmit}>
      <div className="edit-photo">
        <img src={imageUrl ==="" ? user.profilePhoto : imageUrl} alt="profile" />
        <div className="edit-photo-buttons">
          <button type="button" onClick={() => fileRef.current.click()}>
            <input
              ref={fileRef}
              onChange={(e) => {setUserData((prev)=> {return { ...prev , profilePhoto : e.target.files[0]}});setImageUrl(URL.createObjectURL(e.target.files[0]))
            }}
              accept="image/*"
              style={{ display: "none" }}
              type="file"
              name="image"
            />
            change photo
          </button>
          <button onClick={()=> {setUserData((prev)=> {return { ...prev , profilePhoto : "defaultWebp.webp"}}); console.log(userData) ;setImageUrl("http://localhost:5000/defaultWebp.webp") }} type="button" >Delete Photo</button>
        </div>
      </div>
      <br />
      <div className="edit-userinfo">
        <div className="edit-username">
          <label>Username</label>
          <input
            disabled
            name="username"
            onChange={(e) => setUserData((prev)=> { return { ...prev , name : e.target.value }})}
            type="text"
            defaultValue={user.username}
          />
          <span onClick={()=>{
            formRef.current.username.disabled = false
            formRef.current.username.focus()
          }} className="material-symbols-outlined">edit</span>
        </div>
        <div className="edit-email">
          <label>Email</label>
          <input
            disabled
            onChange={(e) => setUserData((prev)=> { return { ...prev , email : e.target.value }})}
            name="email"
            type="email"
            value={user.email}
          />
          {/* <span onClick={()=>{
            formRef.current.email.disabled = false
            formRef.current.email.focus()
          }} className="material-symbols-outlined">edit</span> */}
        </div>
        <div className="edit-bio">
          <label>bio</label>
          <textarea
            disabled
            onChange={(e) => setUserData((prev)=> { return { ...prev , bio : e.target.value }})}
            name="bio"
            defaultValue={user.bio}
          ></textarea>
          <span onClick={()=>{
            formRef.current.bio.disabled = false
            formRef.current.bio.focus()
          }} className="material-symbols-outlined">edit</span>
        </div>
      </div>
      <br />
      <div className="user-settings-buttons">
        <button type="submit">save</button>
        <button type="reset">reset</button>
      </div>
    </form>
    </>
  );
}

export default UserInfo;
