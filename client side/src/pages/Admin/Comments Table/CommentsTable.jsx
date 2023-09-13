import React, { useEffect, useState } from 'react';
import Pagination from '../../../Utils/Pagination';
import "./commentTable.css";
import {useNavigate} from "react-router-dom" ;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CommentsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [deleteComment, setDeleteComment] = useState(null);
    const [adminModal, setAdminModal] = useState(false);
    const [searchedComment, setSearchedComment] = useState("");
    const [adminDeleteModal, setAdminDeleteModal] = useState(false);
    const [searchedCommentsPerPage , setSearchedCommentsPerPage]= useState("");
    const [searchedComments , setSearchedComments] = useState([])
    const [displayedComments , setDisplayedComments] = useState([])
  
    const navigate = useNavigate()

    const itemsPerPage = 10;
    const fInd = (currentPage - 1) * itemsPerPage;
    const sInd = fInd + itemsPerPage;
  
    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/user/admin/getAllComments` , {credentials : "include"})
        .then(res=> res.json())
        .then(data=> {setComments(data.data.map((comment)=>{
          comment.isChecked = false;
          return comment
        }))})
        .catch(err=> toast.error("something went wrong"))
          
      }, []);
    
      useEffect(()=>{
        let newDataPaginated = comments.slice(fInd, sInd);
        setDisplayedComments( newDataPaginated)
      },[comments , currentPage])

      const handleDeleteComment = (commentId) => {
        setDeleteComment(commentId);
      };
    
    
    
      const handleSelectAll = (e) => {
        if (e.target.checked) {
          setSelectedComments(comments.map((comment) => comment._id));
        } else {
          setSelectedComments([]);
        }
      };
    
      const handleSelectComment = (commentId) => {
        if (selectedComments.includes(commentId)) {
          setSelectedComments(selectedComments.filter((id) => id !== commentId));
        } else {
          setSelectedComments([...selectedComments, commentId]);
        }
      };
    
      const handleDeleteSelectedComments = () => {
        toast("please wait...")
        fetch(`http://localhost:5000/api/v1/post/deletingCommentsByAdmin/comment` , {
          method : "DELETE",
          headers : {
            'Content-Type': 'application/json'
          },
          credentials : "include",
          body : JSON.stringify(selectedComments)
          
        })
        .then(res=> res.json())
        .then(data=> {
          if( !data.state.includes("deleted")) return toast.error("some things went wrong")
          setComments(comments.filter((comment) => !selectedComments.includes(comment._id)));
          setSelectedComments([]);
          setAdminModal(false)
          toast.success("comments deleted successfully") 
      })
        .catch(err=> toast.error("some things went wrong"))
        
      };
    
      const handleConfirmDeleteComment = (comment) => {
        toast("please wait...")
         fetch(
          `http://localhost:5000/api/v1/post/${comment?.post?._id}/comment/${comment?._id}`,
          {
            method: "DELETE",
            credentials: "include",
          })
          .then(res => res.json())
          .then(data =>{
            if(data.state !== "success") return toast.error("some thing went wrong")

            setComments((prev)=>{ 
              
              const deletedComment = prev.find((elm) => elm._id === comment._id);
              let newprev = prev.filter((elm) => elm._id !== deletedComment._id)
              return newprev
            });

            setDeleteComment(null);
            toast.success("comment deleted successfully")

          })
      };
    
      const handleCancelDeleteComment = () => {
        setDeleteComment(null);
      };
    

      const handleSearch = (e) => {
        setSearchedComment( (prev)=> {
          
          setSearchedCommentsPerPage(comments?.filter((comment) => comment?.comment?.includes(e.target.value)).slice(fInd , sInd))
          setSearchedComments(comments?.filter((comment) => comment?.comment?.includes(e.target.value)))
          prev = e.target.value
          return prev
      });
      };

      const handleNavPost = (postId)=>{
        navigate(`/post/${postId}`)
      }
      const handleNavUser = (userID)=>{
        navigate(`/user/${userID}`)
      }

  return (
    <>
    <ToastContainer />
      {adminModal ? (
        <div className="admin-modal">
          <div className="admin-popup">
            {adminDeleteModal && (
              <>
                <h2>You are going to delete comments, confirm ?</h2>
                <div className="admin-modal-buttons">
                  <button type="submit" onClick={handleDeleteSelectedComments}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setAdminDeleteModal(false);
                      setAdminModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) }
          </div>
        </div>
      ) : null}
      <div className="admin-table-cont">
        <button
          className="delete-all"
          disabled={selectedComments.length === 0}
          type="button"
          onClick={() => {
            setAdminDeleteModal(true);
            setAdminModal(true);
          }}
        >
          Delete selected comments
        </button>
        <table>
          {comments && comments.length > 0 ? (
            <>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleSelectAll} />
                  </th>
                  
                    <th>
                        <span>
                      Comment
                      <span>
                        <input
                          type="text"
                          placeholder="search by comment"
                          // value={searchedEmail}
                          onChange={handleSearch}
                        />
                        <span class="material-symbols-outlined">search</span>
                        </span>
                        </span>
                      </th>
                <th>user</th>
                  <th>view post</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {searchedComment.trim() !== ""
                  ? searchedCommentsPerPage.map((searchedComment) => {
                      return (
                        <>
                          <tr key={searchedComment._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedComments.includes(
                                  searchedComment._id
                                )}
                                onChange={() =>
                                  handleSelectComment(searchedComment._id)
                                }
                              />
                            </td>
                            <td>{searchedComment.comment}</td>
                            <td>
                              <div>
                                <img
                                  src={searchedComment.user.profilePhoto}
                                  alt="profile"
                                  onClick={()=> handleNavUser(searchedComment.user._id)}
                                />
                                <div>
                                  <h4 onClick={()=> handleNavUser(searchedComment.user._id)}>{searchedComment.user.name}</h4>
                                  <h5 onClick={()=> handleNavUser(searchedComment.user._id)}>{searchedComment.user.email}</h5>
                                </div>
                              </div>
                            </td>
                            <td className='comment-table-post'>
                              <button onClick={()=> handleNavPost(searchedComment.post._id)}>view post</button>
                            </td>
                            <td>
                              {deleteComment?._id === searchedComment._id ? (
                                <div className="delete-user-confirm">
                                  <button onClick={()=>handleConfirmDeleteComment(deleteComment)}>
                                    Confirm
                                  </button>
                                  <button onClick={handleCancelDeleteComment}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() =>
                                    handleDeleteComment(searchedComment)
                                  }
                                  class="material-symbols-outlined delete"
                                >
                                  delete
                                </span>
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    })
                  : displayedComments.map((comment, ind) => {
                    
                      return (
                        <>
                          <tr key={comment._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedComments.includes(comment._id)}
                                onChange={() => handleSelectComment(comment._id)}
                              />
                            </td>
                            <td>{comment.comment}</td>
                            <td>
                              <div>
                                <img onClick={()=> handleNavUser(comment.user._id)} src={comment.user.profilePhoto} alt="profile" />
                                <div>
                                  <h4 onClick={()=> handleNavUser(comment.user._id)} >{comment.user.name}</h4>
                                  <h5 onClick={()=> handleNavUser(comment.user._id)} >{comment.user.email}</h5>
                                </div>
                              </div>
                            </td>
                            <td className='comment-table-post'>
                              <button onClick={()=> handleNavPost(comment.post._id)}>view post</button>
                            </td>
                            <td>
                              {deleteComment?._id === comment._id ? (
                                <div className="delete-user-confirm">
                                  <button onClick={()=>handleConfirmDeleteComment(deleteComment)}>
                                    Confirm
                                  </button>
                                  <button onClick={handleCancelDeleteComment}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => handleDeleteComment(comment)}
                                  class="material-symbols-outlined delete"
                                >
                                  delete
                                </span>
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    })}
              </tbody>
            </>
          ) : (
            <h1>no comments</h1>
          )}
        </table>
        {searchedComment !=="" && searchedComments.length === 0  ? null : comments.length === 0 ? null : <Pagination
        searchedEmail={searchedComment}
        searchedUsers={searchedComments}
          itemsPerPage={itemsPerPage}
          displayedUsers={displayedComments}
          users={comments}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
     }
        
      </div>
    </>
  )
}

export default CommentsTable