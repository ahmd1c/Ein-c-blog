import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate, Route, useNavigate } from "react-router-dom";
import "./post.css";
import Comment from "../Comments/Comment";
import { useSelector } from "react-redux";
import UpdatePost from "../../updatePost/UpdatePost";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Post() {
  const [post, setPost] = useState();
  const param = useParams();
  const [postId , setPostId ] = useState(param.post)
  const [showComments, setShowComments] = useState(false);
  const [commentsCount , setCommentsCount] = useState(0);
  const [updatePostModal , setUpdatePostModal] = useState(false)

  const navigate = useNavigate()
  
  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/post/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(()=> data.data);
        setCommentsCount(()=> data.commentsCount)

      })
      .catch((err) => toast.error("something went wrong"));
  }, [postId]);


  async function handleLikeUnlike() {
    try{
      toast("please wait...")
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${postId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
      );
      const data = await response.json();
      setPost((prev)=> { return {...prev , likes : data.data.likes}})

    }catch(err){
      return toast.error("something went wrong")
    }
  }

  const handleDeletePost = async () => {
    toast("please wait...")
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${param.post}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.state === "success") {
      setPost(()=> null)
      toast.success("post has been successfully deleted")
      navigate("/posts" , {replace:true})
      return
    }
    toast.error("something went wrong")
  };

  return (
    <>
    <ToastContainer />
    <div  className="single-post-cont">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <h2>{post.description}</h2>
          <div className="single-post-details">
            <span>
              <b>By : </b> <Link>{post.author?.name}</Link>
              <img src={post.author?.profilePhoto} alt="profilePhoto" />

            </span>
            <small>
              <b>Published on : </b> {post.createdAt.split("T")[0]}
            </small>
          </div>
          <p>{post.subject}</p>

          {showComments && <Comment />}
          <div className="post-fixed-details">
            {user.id === post.author._id || user.role === "admin" ? (
              <span onClick={handleDeletePost} className="material-symbols-outlined">delete_forever</span>
            ) : null }{
              user.id === post.author._id ? (
              <span onClick={()=>setUpdatePostModal(true)} data-name="edit" className="material-symbols-outlined">edit_square</span>
            ) : null}
            <span data-name="comments" data-count={commentsCount} onClick={()=> setShowComments(()=> true)} className="material-symbols-outlined">chat</span>{" "}
            <span style={{color : post.likes.includes(user.id) && "red"}} onClick={handleLikeUnlike} data-count={post.likes.length} data-name="like" className="material-symbols-outlined">favorite</span>
          </div>
        </>
      ) : (
        <h1>no post</h1>
        )}
        { updatePostModal &&  <UpdatePost updatePostModal={updatePostModal} setUpdatePostModal={setUpdatePostModal} setPost={setPost} post={post} />}
    </div>
    </>
  );
}

export default Post;
