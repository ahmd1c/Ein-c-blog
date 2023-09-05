import React, { useCallback, useEffect, useRef, useState } from "react";
import "./posts.css";

function Posts() {
  const [pageNumber , setPageNumber] = useState(1);
  const [hasMore , setHasMore] = useState(false)
  const [posts, setPosts] = useState([]);
  const [isLoading , setIsLoading] = useState(false)
  const [isError , setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const controller = new AbortController()
    const {signal} = controller
    fetch(`http://localhost:5000/api/v1/post/getAllPosts?page=${pageNumber}` , {
      signal
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setIsError(false)
        setPosts((prev) => [...prev , ...data.data])
        setHasMore(data.paginationInfo.hasMore)
      }).catch(err =>{
        if(signal.aborted) return
        setIsLoading(false);
        setIsError(true);
      })
      return ()=>{
        controller.abort()
      }
  }, [pageNumber]);

  // we will apply a simulation to the infinite scrolling here .

  const observer = useRef()

  const lastElement = useCallback((element)=>{
    if(isLoading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(enteries =>{
      if(enteries[0].isIntersecting && hasMore){
        setPageNumber(prev => prev + 1)
        
      }
    })
    if(element) observer.current.observe(element)

  },[isLoading , hasMore])


    return (
    <div className="all-posts-cont">
      <h1>All Posts</h1>
      {isLoading && <h2 style={{color : "white"}}>Loading...</h2>}
      {posts.length > 0 && 
      <div className="posts">
        { posts.map((post, ind) => {
          if (posts.length === ind + 1) {
            return (
              <div ref={lastElement} className="post" key={ind}>
                <img src={post.cover} alt="post" />
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <br />
              </div>
            );
          } else {
            return (
              <div className="post" key={ind}>
                <img src={post.cover} alt="post" />
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <br />
              </div>
            );
          }
        })}
      </div>
      }
      {isError && <h2>Some thing went wrong</h2>} 
    </div>
  );
}

export default Posts;
