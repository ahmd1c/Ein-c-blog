import React, { useRef, useState } from 'react'
import "./updatepost.css"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UpdatePost({ updatePostModal, setUpdatePostModal , post , setPost}) {
  

  const [imageUrl , setImageUrl] = useState("")
  const [postData , setPostData] = useState({
    title : post.title,
    description : post.description,
    subject: post.subject,
    postPhoto : post.cover
  })
  const createPostFormRef = useRef(null)
  const photoRef = useRef(null)

  const navigate = useNavigate()

  const handleUpdatePost =  (e) => {
    toast("please wait...")
    e.preventDefault();
      
    const formData = new FormData();
    formData.set("title", postData.title);
    formData.set("description", postData.description);
    formData.set("subject", postData.subject);
    formData.set("postPhoto", postData.postPhoto);

    fetch(`http://localhost:5000/api/v1/post/${post._id}` , {
      method : "PUT",
      headers :{
        "Content/Type" : "application/json"
      },
      credentials : "include",
      body : formData
      
    }).then(res => res.json()).then(data => {
      if (data.state !== "success") return toast.error("something went wrong, please try again")

      setPost(()=> data.data)
      toast.success("post is successfully updated")
      navigate(`/post/${data.data._id}` , {replace : true})
      setUpdatePostModal(false)
      
    })
      .catch(err => toast.error("something went wrong, please try again"))
  };

  return (
    <>
    <ToastContainer />
    <div className="update-post-cont">
      <form ref={createPostFormRef} onSubmit={handleUpdatePost} >
          <input type="text" value={postData.title} name='title' onChange={(e)=>setPostData((prev)=> { return {...prev , title : e.target.value}})} placeholder="Title" required id='post-title' />
          <textarea value={postData.description} name="description" onChange={(e)=>setPostData((prev)=> { return {...prev , description : e.target.value}})} placeholder='Description' id="description" ></textarea>

          <textarea value={postData.subject} name="subject" onChange={(e)=>setPostData((prev)=> { return {...prev , subject : e.target.value}})} placeholder='article' id="article" ></textarea>
          <div className="update-post-photo">
             <img src={imageUrl !=="" ? imageUrl : postData.postPhoto} alt="cover" /> 
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
        <div style={{display : "flex" , gap : "15px"}} className="update-post-buttons">
            <button type="submit">submit</button>
            <button onClick={()=> setUpdatePostModal(false)} type="button">Cancel</button>
        </div>
      </form>

    </div>
    </>
  )
}

export default UpdatePost