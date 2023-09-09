import React, { useEffect,  useMemo,  useRef,  useState } from "react";
import { useNavigate } from "react-router-dom";
import "./usercomments.css"
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserComments() {
  
  const [userCommentsList, setUserCommentsList] = useState([]);
  const [modifiedComment, setModifiedComment] = useState({});
  const [modifyModal, setModifyModal] = useState(false);
  const modifyRef = useRef();
  

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handlepost = (id) => {
    navigate("/post/" + id);
  };

  useEffect(()=>{
      fetch("http://localhost:5000/api/v1/user/userComments" , {
        credentials : "include"
      })
  .then(response => response.json())
  .then(data =>{
    if(data.state === "success"){ return setUserCommentsList(data.data)}})
  },[])

  const handleDeleteComment = async (comment) => {
    toast("please wait...")
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${comment?.post?._id}/comment/${comment?._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.state === "success") {
      const newComments = userCommentsList.filter((elm) => elm._id !== comment._id);
      setUserCommentsList(() => [...newComments]);
      toast.success("comment deleted successfully")
    }else{
      toast.error("Something went wrong")
    }
  };

  const handleModifyCommentSubmit = async (e, modifiedComment) => {
    toast("please wait...")
    e.preventDefault();
    if (modifyRef.current.value.trim() === "") return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/post/${modifiedComment?.post?._id}/comment/${modifiedComment._id}`,
        {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: modifyRef?.current?.value,
          }),
        }
      );

      const data = await response.json();
      let newComments = [...userCommentsList];

      // replacing the old version of the comment with the new one.
      const modifiedInd = newComments.findIndex( (elm) => elm._id === data.data._id );
      if (modifiedInd !== -1) {
        newComments.splice(modifiedInd, 1, data.data);
      }
      setUserCommentsList([...newComments]);
      setModifyModal(false);
      toast.success("comment has been updated successfully")
    } catch (error) {
      toast.error("something went wrong")
    }
  };


  return (
    <>
    <ToastContainer />
    {modifyModal ? (
        <div className="comment-modify-modal">
          <div className="comment-modify-popup">
            <form
              onSubmit={(e) => handleModifyCommentSubmit(e, modifiedComment)}
            >
              <textarea
                defaultValue={modifiedComment?.comment}
                ref={modifyRef}
                name=""
              ></textarea>
              <div className="comment-modify-buttons">
                <button type="submit">update comment</button>
                <button onClick={() => setModifyModal(false)}>cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      
    <div className="user-comments-cont">
      {userCommentsList.length > 0 ? 
        userCommentsList.map((userComment)=>{
          return(
        <div key={userComment._id} className="single-comment-cont">
                  <div className="single-comment-box">
                    <div className="upper-details">
                      <span>{user.username}</span>
                      <img src={user.profilePhoto} alt="profilePhoto" />
                      
                        <div className="comment-modify-delete">
                          <span
                            onClick={() => {
                              setModifyModal(true);
                              setModifiedComment(userComment);
                            }}
                            className="material-symbols-outlined"
                          >
                            edit
                          </span>
                          <span
                            onClick={()=>handleDeleteComment(userComment)}
                            className="material-symbols-outlined"
                          >
                            delete
                          </span>
                        </div>
                      
                    </div>
                    <p>{userComment?.comment}</p>
                    <div className="lower-details">
                      <span>created at: {userComment?.createdAt?.split("T")[0]}</span>
                    </div>
                  </div>
                  <h5 style={{cursor:"pointer"}} >post title : {userComment?.post?.title}</h5>
    </div>
    )
  }) : <h1>no comments to show</h1>}
    </div>
    </>
  )
}

export default UserComments