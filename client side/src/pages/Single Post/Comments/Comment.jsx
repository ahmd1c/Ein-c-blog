import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./comment.css";
import { useSelector } from "react-redux";
import Replies from "../Replies/Replies";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Comment() {
  const param = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [modifiedComment, setModifiedComment] = useState({});
  const [modifyModal, setModifyModal] = useState(false);
  const [showedInd, setShowedInd] = useState();
  const [showReplies, setShowReplies] = useState(false);

  const userId = useSelector((state) => state.user.id);
  const modifyRef = useRef();

  const fetchComments = useCallback(() => {
    fetch(`http://localhost:5000/api/v1/post/${param.post}/comment`)
    .then((response) => response.json())
    .then((data) => {
        setComments(data.data);
      })
      .catch((err) => toast.error("something went wrong"));
    },[param.post]);

    useEffect(()=> {
      fetchComments()
    } ,[fetchComments])

  const handleCreateComment = async (e) => {
    toast("please wait...")
    e.preventDefault();
    if (comment.trim() === "") return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/post/${param.post}/comment`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: comment,
          }),
        }
      );

      const data = await response.json();
      setComments([...comments, data.data]);
      e.target.comment.value = "";
      toast.success("comment added successfully")
    } catch (error) {
      toast.error("something went wrong")    }
  };

  async function handleLikeUnlike(comment) {
    toast("please wait..." , {autoClose : 3000})
    try{
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${param.post}/comment/${comment?._id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    let newComments = [...comments];
    const likedInd = newComments.findIndex((elm) => elm._id === data.data._id);
    if (likedInd !== -1) {
      newComments.splice(likedInd, 1, data.data);
    }
    setComments([...newComments]);
    }catch(err){
      return toast.error("something went wrong")
    }
  }

  const handleDeleteComment = async (comment) => {
    toast("please wait...")
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${param.post}/comment/${comment?._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.state === "success") {
    }
    let newComments = [...comments];
    newComments = newComments.filter((elm) => elm._id !== comment._id);
    setComments(() => [...newComments]);
    toast.success("comment has been added")
  };

  const handleModifyCommentSubmit = async (e, modifiedComment) => {
    toast("please wait...")
    e.preventDefault();
    if (modifyRef.current.value.trim() === "") return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/post/${param.post}/comment/${modifiedComment._id}`,
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
      let newComments = [...comments];
      const modifiedInd = newComments.findIndex(
        (elm) => elm._id === data.data._id
      );
      if (modifiedInd !== -1) {
        newComments.splice(modifiedInd, 1, data.data);
      }
      setComments([...newComments]);
      setModifyModal(false);
      toast.success("comment has been updated")
    } catch (error) {
      toast.error("something went wrong")    }
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
      <div className="comment-cont">
        <h2 onClick={fetchComments}>Comments : {comments.length}</h2>
        <form onSubmit={handleCreateComment}>
          <textarea
            onChange={(e) => {
              setComment(e.target.value);
            }}
            name="comment"
            id="comment"
            placeholder="Write Comment"
          ></textarea>
          <button type="submit">Add Comment</button>
        </form>

        <div className="all-comments-box">
          {comments.length > 0 ? (
            comments.map((comment, ind) => {
              return comment.isReply ? null : (
                <div key={comment?._id} className="single-comment-cont">
                  <div className="single-comment-box">
                    <div className="upper-details">
                      <span>{comment?.user?.name}</span>
                      <img src={require("../../../assets/default.png")} alt="profilePhoto" />
                      {comment.user._id === userId && (
                        <div className="comment-modify-delete">
                          <span
                            onClick={() => {
                              setModifyModal(true);
                              setModifiedComment(comment);
                            }}
                            className="material-symbols-outlined"
                          >
                            edit
                          </span>
                          <span
                            onClick={() => handleDeleteComment(comment)}
                            className="material-symbols-outlined"
                          >
                            delete
                          </span>
                        </div>
                      )}
                    </div>
                    <p>{comment.comment}</p>
                    <div className="lower-details">
                      <span>{comment?.createdAt.split("T")[0]}</span>
                    </div>
                  </div>
                  <div className="like-reply">
                    <div>
                      <span
                        data-color={
                          comment.likes.includes(userId) ? "liked" : "unliked"
                        }
                        onClick={() => handleLikeUnlike(comment)}
                        className="material-symbols-outlined"
                      >
                        favorite
                      </span>
                      <small>{comment.likes?.length}</small>
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          showedInd !== ind
                            ? setShowedInd(ind)
                            : setShowReplies((prev) => !prev);
                        }}
                        className="material-symbols-outlined"
                      >
                        comment{" "}
                      </span>

                      <small>{comment.replies?.length}</small>
                    </div>
                  </div>

                  {showedInd === ind ? (
                    <Replies
                      comments={comments}
                      setComments={setComments}
                      setShowReplies={setShowReplies}
                      showReplies={showReplies}
                      comment={comment}
                      modifyRef={modifyRef}
                    />
                  ) : null}
                </div>
              );
            })
          ) : (
            <h2>no comments</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default Comment;
