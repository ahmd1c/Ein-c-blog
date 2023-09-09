import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import photo from "../../../assets/javier-miranda-MrWOCGKFVDg-unsplash.jpg";
import "./userposts.css";
import { useSelector } from "react-redux";

function UserPosts({profile , settings}) {
  
  const [userPostsList, setUserPostsList] = useState([]);
  const navigate = useNavigate();
  const handlepost = (id) => {
    navigate("/post/" + id);
  };
  const user = useSelector((state) => state.user);

  useEffect(()=>{
      fetch(`http://localhost:5000/api/v1/post/getAllPostsForSpecificUser/${user.id}`)
  .then(response => response.json())
  .then(data =>{
    if(data.state === "success"){ return setUserPostsList(data.data)} })
  return ()=> setUserPostsList([])
  },[user.id])
  return (
    <div className="user-posts-cont">
      {userPostsList.length > 0 ? 
      userPostsList.map((userPost)=>{
        return (
        <div key={userPost._id} className="post-box">
        <img onClick={()=>handlepost(userPost._id)} src={userPost.cover} alt="" />
        <h3 onClick={()=>handlepost(userPost._id)}  >{userPost.title}</h3>
        <p  onClick={()=>handlepost(userPost._id)} >{userPost.description}</p>
        <div className="details">
          <span>created at : {userPost.createdAt.split("T")[0]} </span>
          <span>author : {user.username} </span>
        </div>
        
      </div>
        )
      })
  : <h1>no posts to show</h1>}
    </div>
  );
}

export default UserPosts;
