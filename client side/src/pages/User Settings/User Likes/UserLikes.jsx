import React, { useEffect, useState } from "react";
import "./userlikes.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function UserLikes() {
  const [postsLikes , setPostsLikes] = useState([])
  const [commentsLikes , setCommentsLikes] = useState([])


  useEffect(()=>{
    fetch("http://localhost:5000/api/v1/user/userLikes" , {
      credentials : "include",
    })
    .then(res => res.json())
    .then(data=> {data.state === "success" && 
      setPostsLikes(data.postsLikes)
      setCommentsLikes(data.commentsLikes)
    
    }) 
  },[])


  const handleDeletePostLike = async(post)=>{
    toast("please wait...")
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${post?._id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    if(data.state === "unliked") {

      const newPostsLikes = postsLikes.filter((elm) => elm._id !== data.data._id);
      setPostsLikes(newPostsLikes)
      toast.success("like has been removed")
    }else{
      return toast.error("some thing went wrong")
    }
  }

  const handleDeleteCommentLike = async(comment)=>{
    toast("please wait...")
    const response = await fetch(
      comment.isReply === true  ? 
      `http://localhost:5000/api/v1/post/${comment?.post}/comment/${comment?.parentComment}/reply/${comment?._id}` :
      `http://localhost:5000/api/v1/post/${comment?.post}/comment/${comment?._id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    if(data.state === "unliked") {
      const newCommentsLikes = commentsLikes.filter((elm) => elm._id !== data.data._id);
      setCommentsLikes([...newCommentsLikes])
      toast.success("like has been removed")
    }else{
      return toast.error("some thing went wrong")
    }
  }


  return (
    <>
    <ToastContainer />
    <div className="user-likes-cont">
      <div className="user-likes-posts">
        <table>
          <tr>
            <th>post title</th>
            <th>date</th>
            <th>delete</th>
          </tr>
          {postsLikes.length > 0 ? 
            postsLikes.map((postLike)=>{
              return (
                <tr>
            <td>{postLike?.title}</td>
            <td>{postLike.createdAt.split("T")[0]}</td>
            <td>
              <span onClick={()=> handleDeletePostLike(postLike) } className="material-symbols-outlined">delete</span>
            </td>
          </tr>
              )
            })
            : <tr>
              <td>no likes</td>
              </tr>}
          
        </table>
      </div>
      <div className="user-likes-comments">
        <table>
          <tr>
            <th>comment message</th>
            <th>date</th>
            <th>delete</th>
          </tr>
          {commentsLikes.length > 0 ? 
            commentsLikes.map((commentLike)=>{
              return (
                <tr>
            <td>{commentLike?.comment}</td>
            <td>{commentLike?.createdAt.split("T")[0]}</td>
            <td>
              <span onClick={()=>handleDeleteCommentLike(commentLike)} className="material-symbols-outlined">delete</span>
            </td>
          </tr>
              )
            })
            : <tr>
              <td>no likes</td>
              </tr>}
                  </table>
      </div>
    </div>
    </>
  );
}

export default UserLikes;
