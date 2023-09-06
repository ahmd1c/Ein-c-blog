import React, { useRef, useState } from 'react'
import {useNavigate} from "react-router-dom" 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './createpost.css'

function Createpost() {
  const [imageUrl , setImageUrl] = useState("")
  const [postData , setPostData] = useState({
    title : "",
    description : "",
    subject: "",
    postPhoto : ""
  })
  const createPostFormRef = useRef(null)
  const photoRef = useRef(null)

  const navigate = useNavigate()

  const handleCreatePost =  (e) => {

    e.preventDefault();
    if (
      postData.title.trim() === "" ||
      postData.description.trim() === "" ||
      postData.subject.trim() === "" ||
      postData.postPhoto === ""
    ) return toast("please fill the required fields")
      
    const formData = new FormData();
    formData.set("title", postData.title);
    formData.set("description", postData.description);
    formData.set("subject", postData.subject);
    formData.set("postPhoto", postData.postPhoto);

    fetch("http://localhost:5000/api/v1/post/createPost" , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      credentials : "include",
      body : formData
      
    }).then(res => res.json()).then(data => {
      if (data.state !== "success") return toast.error("failed , please try again")

      toast.success("Post is created successfully")
      navigate(`/post/${data.data._id}`)
      
    })
      .catch(err => toast.error("some thing went wrong , please try again"))

  };

  return (
    <>
    <ToastContainer />
    <div className="create-post-cont">
      <form ref={createPostFormRef} onSubmit={handleCreatePost} >
          <input type="text" name='title' onChange={(e)=>setPostData((prev)=> { return {...prev , title : e.target.value}})} placeholder="Title" required id='post-title' />
          <textarea name="description" onChange={(e)=>setPostData((prev)=> { return {...prev , description : e.target.value}})} placeholder='Description' id="description" ></textarea>

          <textarea name="subject" onChange={(e)=>setPostData((prev)=> { return {...prev , subject : e.target.value}})} placeholder='article' id="article" ></textarea>
          <div className="create-post-photo">
            {imageUrl !=="" && <img src={imageUrl} alt="cover" />}
        <div className="add-photo-buttons">
          <button type="button" onClick={() => photoRef.current.click()}>
            <input
              ref={photoRef}
              onChange={(e) => {
                setPostData((prev)=> {return { ...prev , postPhoto : e.target.files[0]}})
                setImageUrl(URL.createObjectURL(e.target.files[0]))
              }}
              accept="image/*"
              style={{ display: "none" }}
              type="file"
              name="postPhoto"
            />
            Add Cover
          </button>
        </div>
      </div>

        <button type="submit">submit</button>
      </form>

    </div>
    </>
  )
}

export default Createpost