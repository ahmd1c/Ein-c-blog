import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./replies.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Replies({
  comment,
  modifyRef,
  comments,
  setComments,
  showReplies,
  setShowReplies,
}) {
  const [replies, setReplies] = useState([]);
  const [modifiedReply, setModifiedReply] = useState({});
  const [modifyModal, setModifyModal] = useState(false);
  const [reply, setReply] = useState("");
  const userId = useSelector((state) => state.user.id);
  const addReplyRef = useRef(null);
  const param = useParams();

  useLayoutEffect(() => {
    fetch(
      `http://localhost:5000/api/v1/post/${param.post}/comment/${comment._id}/reply`
    )
      .then((response) => response.json())
      .then((data) => setReplies(data?.data))
      .catch((err) => toast.error("something went wrong"));
  }, [param.post, comment._id]);

  useEffect(() => setShowReplies(true), []);

  const handleCreateReply = async (e) => {
    toast("please wait...")
    e.preventDefault();
    if (reply.trim() === "") return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/post/${param.post}/comment/${comment._id}/reply`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: reply,
          }),
        }
      );

      const data = await response.json();
      e.target.reply.value = "";
      let newComments = [...comments];
      let newReplies = [...replies, data.data];

      newComments = newComments.map((elm) => {
        if (elm._id === comment._id) elm.replies = [...newReplies];
        return elm;
      });
      setReplies(() => [...newReplies]);
      setComments(() => [...newComments]);
      toast.success("comment added successfully")
    } catch (error) {
      toast.error("something went wrong")    }
  };

  async function handleLikeUnlike(reply) {
    toast("please wait..." , {autoClose : 3000})
    try{
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${param.post}/comment/${comment?._id}/reply/${reply?._id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    let newReplies = [...replies];
    const likedInd = newReplies.findIndex((elm) => elm._id === data.data?._id);
    if (likedInd !== -1) {
      newReplies.splice(likedInd, 1, data.data);
    }
    setReplies([...newReplies]);
    }catch(err){
      return toast.error("something went wrong")
    }
  }

  const handleDeleteReply = async (reply) => {
    toast("please wait...")
    const response = await fetch(
      `http://localhost:5000/api/v1/post/${param.post}/comment/${comment?._id}/reply/${reply?._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.state === "success") {
      let newReplies = [...replies];
      newReplies = newReplies.filter((elm) => elm._id !== reply._id);
      let newComments = [...comments];
      newComments = newComments.map((elm) => {
        if (elm._id === comment._id) elm.replies = [...newReplies];
        return elm;
      });
      setReplies(() => [...newReplies]);
      setComments(() => [...newComments]);
      toast.success("comment has been added")
    }
  };

  const handleModifyReplySubmit = async (e, modifiedReply) => {
    toast("please wait...")
    e.preventDefault();
    if (modifyRef.current.value.trim() === "") return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/post/${param.post}/comment/${comment?._id}/reply/${modifiedReply?._id}`,
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
      let newReplies = [...replies];
      const modifiedInd = newReplies.findIndex(
        (elm) => elm._id === data.data._id
      );
      if (modifiedInd !== -1) {
        newReplies.splice(modifiedInd, 1, data.data);
      }
      setReplies([...newReplies]);
      setModifyModal(false);
      toast.success("comment has been updated")
    } catch (error) {
      toast.error("something went wrong")        }
  };

  return (
    <>
    <ToastContainer />
      {modifyModal ? (
        <div className="comment-modify-modal">
          <div className="comment-modify-popup">
            <form
              className="reply-modal-form"
              onSubmit={(e) => handleModifyReplySubmit(e, modifiedReply)}
            >
              <textarea
                className="reply-modal-textarea"
                defaultValue={modifiedReply?.comment}
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
      <div className={showReplies ? "Reply-cont show" : "Reply-cont"}>
        <div className="Reply-grid">
          {replies?.length > 0
            ? replies.map((reply) => {
                return (
                  <div className="reply-box" key={reply?._id}>
                    <div className="single-comment-box">
                      <div className="upper-details">
                        <span>{reply?.user?.name}</span>
                        <img
                          src={reply?.user?.profilePhoto}
                          alt="profilePhoto"
                        />
                        {reply?.user?._id === userId && (
                          <div className="comment-modify-delete">
                            <span
                              onClick={() => {
                                setModifyModal(true);
                                setModifiedReply(reply);
                              }}
                              className="material-symbols-outlined"
                            >
                              edit
                            </span>
                            <span
                              onClick={() => handleDeleteReply(reply)}
                              className="material-symbols-outlined"
                            >
                              delete
                            </span>
                          </div>
                        )}
                      </div>
                      <p>{reply?.comment}</p>
                      <div className="lower-details">
                        <span>{reply?.createdAt.split("T")[0]}</span>
                      </div>
                    </div>
                    <div className="like-reply">
                      <div>
                        <span
                          data-color={
                            reply?.likes.includes(userId) ? "liked" : "unliked"
                          }
                          onClick={() => handleLikeUnlike(reply)}
                          className="material-symbols-outlined"
                        >
                          favorite
                        </span>
                        <small>{reply?.likes?.length}</small>
                      </div>
                      <div>
                        <span
                          title="Add reply"
                          onClick={() => addReplyRef.current.focus()}
                          className="material-symbols-outlined"
                        >
                          comment{" "}
                        </span>
                        <small>{reply?.replies?.length}</small>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
          <form className="what" onSubmit={handleCreateReply}>
            <textarea
              ref={addReplyRef}
              onChange={(e) => setReply(e.target.value)}
              name="reply"
              id=""
              placeholder="Add Reply"
            ></textarea>
            <button type="submit">Add Reply</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Replies;
