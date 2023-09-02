import React, { useState , useEffect} from "react";
import "./home.css";
import background1 from "../../assets/background1.png"
import photo from "../../assets/javier-miranda-MrWOCGKFVDg-unsplash.jpg"
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {

  

  const [recentPosts , setRecentPosts] = useState([])

  const userId = useSelector((state) => state.user.id);

  const navigate = useNavigate()
  const handlepost = (id)=>{navigate("/post/" + id)}
  useEffect(()=>{
    fetch("http://localhost:5000/api/v1/post/getAllPosts")
    .then(response => response.json())
    .then(data =>  setRecentPosts(()=> {
      return data.data}))
    return ()=> setRecentPosts([])
},[])
  return (
  <>
    <div className="landing">
      <div className="text">
        <h1>Welcome To The World Of Bloging</h1>
        <h2>Scale Your Abilities into The Sky</h2>
        <p>Learn From Experts and Teach Juniors. <br/> { userId ==="" && <>Register Now and Start The Journey</>} </p>
        {userId ==="" && <button>Register</button> }
      </div>
      <div className="image" >
        <img src={background1} alt="blog"/>
      </div>
      {/* <a href="https://storyset.com/online">Online illustrations by Storyset</a>
      <a href="https://www.freepik.com/free-vector/organic-flat-blog-post-illustration-with-people_13914817.htm#query=blog&position=14&from_view=search&track=sph">Image by Freepik</a> */}
    </div>
    <div className="recent-posts-cont">
      <h2>Recent Posts</h2>
      <div className="posts-cont">
        { recentPosts.length  > 0 ? recentPosts.map((post) =>{
          
            const date = new Date( post.createdAt ).toLocaleDateString()  
            return (
              <div onClick={()=>{handlepost( post._id)}} key={post._id} className="post-box">
                <img src={photo} alt="" />
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div className="details">
                  <span>created at : { date } </span>
                  <span>author : {post.author?.name} </span>
                </div>
              </div>
              )
          }) : null 
        }
      </div>
    </div>
  </>
  );
}

export default Home;
