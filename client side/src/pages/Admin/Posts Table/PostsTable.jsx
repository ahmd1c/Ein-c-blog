import React, { useEffect, useState } from 'react'
import "./PostsTable.css"
import Pagination from '../../../Utils/Pagination';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function PostsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [deletePost, setDeletePost] = useState(null);
    const [adminModal, setAdminModal] = useState(false);
    const [searchedPost, setSearchedPost] = useState("");
    const [adminDeleteModal, setAdminDeleteModal] = useState(false);
    const [searchedPostsPerPage , setSearchedPostsPerPage]= useState("");
    const [searchedPosts , setSearchedPosts] = useState([])
    const [displayedPosts, setDisplayedPosts] = useState([]);

    const navigate = useNavigate()


    const itemsPerPage = 10;
    const fInd = (currentPage - 1) * itemsPerPage;
    const sInd = fInd + itemsPerPage;
  
    useEffect(() => {
      fetch(`http://localhost:5000/api/v1/post/getAllPosts` , {credentials : "include"})
      .then(res=> res.json())
      .then(data=> {setPosts(data.data.map((post)=>{
        post.isChecked = false;
        return post
      }))})
      .catch(err=> toast.error("something went wrong"))
      
      }, []);
    
      useEffect(()=>{
        let newPosts = posts
          let newDataPaginated = newPosts.slice(fInd, sInd);
          setDisplayedPosts(newDataPaginated);
      },[posts , currentPage])

      const handleDeletePost = (postId) => {
        setDeletePost(postId);
      };
    
    
    
      const handleSelectAll = (e) => {
        if (e.target.checked) {
          setSelectedPosts(posts.map((post) => post._id));
        } else {
          setSelectedPosts([]);
        }
      };
    
      const handleSelectPost = (postId) => {
        if (selectedPosts.includes(postId)) {
          setSelectedPosts(selectedPosts.filter((id) => id !== postId));
        } else {
          setSelectedPosts([...selectedPosts, postId]);
        }
      };
    
      const handleDeleteSelectedPosts = () => {
        toast("please wait...")
        fetch(`http://localhost:5000/api/v1/post` , {
          method : "DELETE",
          headers : {
            'Content-Type': 'application/json'
          },
          credentials : "include",
          body : JSON.stringify(selectedPosts)
          
        })
        .then(res=> res.json())
        .then(data=> {
          if( !data.state.includes("deleted")) return toast.error("some things went wrong")
          setPosts(posts.filter((post) => !selectedPosts.includes(post._id)));
          setSelectedPosts([]);
          setAdminModal(false)
          toast.success("posts deleted successfully") 
      })
        .catch(err=> toast.error("some things went wrong"))
        
      };
      
      const handleConfirmDeletePost = (post) => {
        toast("please wait...")
        fetch(
         `http://localhost:5000/api/v1/post`,
         {
           method: "DELETE",
           headers : {
            'Content-Type': 'application/json'
          },
           credentials: "include",
           body : JSON.stringify([post._id])
         })
         .then(res => res.json())
         .then(data =>{
           if(!data.state.includes("deleted")) return toast.error("some things went wrong")

           setPosts((prev)=>{ 
             
             const deletedPost = prev.find((elm) => elm._id === post._id);
             let newprev = prev.filter((elm) => elm._id !== deletedPost._id)
             return newprev
           });

           setDeletePost(null);
           toast.success("post deleted successfully")

         })
     };
    
      const handleCancelDeletePost = () => {
        setDeletePost(null);
      };
    
      const handleSearch = (e) => {
        setSearchedPost( (prev)=> {
          
          setSearchedPostsPerPage(posts?.filter((post) => post?.title?.includes(e.target.value)).slice(fInd , sInd))
          setSearchedPosts(posts?.filter((post) => post?.title?.includes(e.target.value)))
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
                <h2>You are going to delete posts, confirm ?</h2>
                <div className="admin-modal-buttons">
                  <button type="submit" onClick={handleDeleteSelectedPosts}>
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
          disabled={selectedPosts.length === 0}
          type="button"
          onClick={() => {
            setAdminDeleteModal(true);
            setAdminModal(true);
          }}
        >
          Delete selected posts
        </button>
        <table>
          {posts && posts.length > 0 ? (
            <>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleSelectAll} />
                  </th>
                  
                    <th>
                        <span>
                      Post title
                      <span>
                        <input
                          type="text"
                          placeholder="search by title"
                          onChange={handleSearch}
                        />
                        <span class="material-symbols-outlined">search</span>
                        </span>
                        </span>
                      </th>
                <th>user</th>
                  <th>view</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {searchedPost.trim() !== ""
                  ? searchedPostsPerPage.map((searchedPost) => {
                      return (
                        <>
                          <tr key={searchedPost._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedPosts.includes(
                                  searchedPost._id
                                )}
                                onChange={() =>
                                  handleSelectPost(searchedPost._id)
                                }
                              />
                            </td>
                            <td>{searchedPost.title}</td>
                            <td>
                              <div>
                                <img
                                  src={searchedPost.author.profilePhoto}
                                  alt="profile"
                                  onClick={()=> handleNavUser(searchedPost.author._id)}
                                />
                                <div>
                                  <h4 onClick={()=> handleNavUser(searchedPost.author._id)} >{searchedPost.author.name}</h4>
                                  <h5 onClick={()=> handleNavUser(searchedPost.author._id)} >{searchedPost.author.email}</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button onClick={()=> handleNavUser(searchedPost._id)} className='view-post'>view post</button>
                            </td>
                            <td>
                              {deletePost?._id === searchedPost._id ? (
                                <div className="delete-user-confirm">
                                  <button onClick={()=>handleConfirmDeletePost(deletePost)}>
                                    Confirm
                                  </button>
                                  <button onClick={handleCancelDeletePost}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() =>
                                    handleDeletePost(searchedPost)
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
                  : displayedPosts.map((post, ind) => {
                    
                      return (
                        <>
                          <tr key={post._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedPosts.includes(post._id)}
                                onChange={() => handleSelectPost(post._id)}
                              />
                            </td>
                            <td>{post.title}</td>
                            <td>
                              <div>
                                <img onClick={()=> handleNavUser(post.author._id)} src={post.author.profilePhoto} alt="profile" />
                                <div>
                                  <h4 onClick={()=> handleNavUser(post.author._id)} >{post.author.name}</h4>
                                  <h5 onClick={()=> handleNavUser(post.author._id)} >{post.author.email}</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button onClick={()=> handleNavPost(post._id)} className='view-post'>view post</button>
                            </td>
                            <td>
                              {deletePost?._id === post._id ? (
                                <div className="delete-user-confirm">
                                  <button onClick={()=>handleConfirmDeletePost(deletePost)}>
                                    Confirm
                                  </button>
                                  <button onClick={handleCancelDeletePost}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => handleDeletePost(post)}
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
            <h1>no posts</h1>
          )}
        </table>
        {searchedPost !=="" && searchedPosts.length === 0 ? null : posts.length === 0 ? null : <Pagination
        searchedEmail={searchedPost}
        searchedUsers={searchedPosts}
          itemsPerPage={itemsPerPage}
          displayedUsers={displayedPosts}
          users={posts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
     }
        
      </div>
    </>
  )
}

export default PostsTable