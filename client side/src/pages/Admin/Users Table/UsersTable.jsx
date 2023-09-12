import React, { useEffect,  useState } from "react";
import "./usersTable.css";
import Pagination from '../../../Utils/Pagination';
import { useNavigate} from "react-router-dom" ;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteUser, setDeleteUser] = useState(null);
  const [adminModal, setAdminModal] = useState(false);
  const [searchedEmail, setSearchedEmail] = useState("");
  const [adminDeleteModal, setAdminDeleteModal] = useState(false);
  const [searchedUsersPerPage , setSearchedUsersPerPage]= useState("");
  const [searchedUsers , setSearchedUsers] = useState([])
  const [displayedUsers, setDisplayedUsers] = useState([]);

  const navigate = useNavigate()



  const itemsPerPage = 10;
  const fInd = (currentPage - 1) * itemsPerPage;
  const sInd = fInd + itemsPerPage;


  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/user/admin/getAllUsers`,{credentials : "include"})
    .then(res=> res.json())
    .then(data=> setUsers(data.data.map((user)=>{
      user.isChecked = false;
      return user
    })))
    .catch(err=> toast.error("something went wrong"))
      
  }, []);

  useEffect(()=>{
    let newUSers = users
    let newDataPaginated = newUSers.slice(fInd, sInd);
    setDisplayedUsers(newDataPaginated);
  },[users , currentPage])

  const handleDeleteUser = (userId) => {
    setDeleteUser(userId);
  };



  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteSelectedUsers = () => {
        toast("please wait...")
        fetch(`http://localhost:5000/api/v1/user` , {
          method : "DELETE",
          headers : {
            'Content-Type': 'application/json'
          },
          credentials : "include",
          body : JSON.stringify(selectedUsers)
          
        })
        .then(res=> res.json())
        .then(data=> {
          if( !data.state.includes("deleted")) return toast.error("something went wrong")
          setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
          setSelectedUsers([]);
          setAdminModal(false) 
          toast.success("comment deleted successfully")
      })
        .catch(err=> toast.error("something went wrong"))
        ;
  };

  const handleConfirmDeleteUser = (user) => {
    let listId = [user._id]
    toast("please wait...")
    fetch(
     `http://localhost:5000/api/v1/user`,
     {
       method: "DELETE",
       headers : {
        'Content-Type': 'application/json'
      },
       credentials: "include",
       body : JSON.stringify(listId)
     })
     .then(res => res.json())
     .then(data =>{
       if(!data.state.includes("deleted")) return toast.error("something went wrong")

       setUsers((prev)=>{ 
         
         const deletedUser = prev.find((elm) => elm._id === user._id);
         let newprev = prev.filter((elm) => elm._id !== deletedUser._id)
         return newprev
       });

       setDeleteUser(null);
       toast.success("comment deleted successfully")

     })
 };
  const handleCancelDeleteUser = () => {
    setDeleteUser(null);
  };

  const handleSearch = (e) => {
    setSearchedEmail( (prev)=> {
      
      setSearchedUsersPerPage(users?.filter((user) => user?.email?.includes(e.target.value)).slice(fInd , sInd))
      setSearchedUsers(users?.filter((user) => user?.email?.includes(e.target.value)))
      prev = e.target.value
      return prev
  });
  };
  

  const handleNavUser = (userID)=>{
    navigate(`/user/${userID}`)
  }

  return (
    <>
    <ToastContainer />
      {adminModal ? (
        <div className="admin-modal">
          <div className="admin-popup">
            {adminDeleteModal ? (
              <>
                <h2>You are going to delete users, confirm ?</h2>
                <div className="admin-modal-buttons">
                  <button type="submit" onClick={handleDeleteSelectedUsers}>
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
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="users-table-cont">
        <button
          className="delete-all"
          disabled={selectedUsers.length === 0}
          type="button"
          onClick={() => {
            setAdminDeleteModal(true);
            setAdminModal(true);
          }}
        >
          Delete selected users
        </button>
        <table>
          {users && users.length > 0 ? (
            <>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleSelectAll} />
                  </th>
                  <th>
                    <span>
                      User
                      <span>
                        <input
                          type="text"
                          placeholder="search by email"
                          // value={searchedEmail}
                          onChange={handleSearch}
                        />
                        <span class="material-symbols-outlined">search</span>
                      </span>
                    </span>
                  </th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {searchedEmail.trim() !== ""
                  ? searchedUsersPerPage.map((searchedUser) => {
                      return (
                        <>
                          <tr key={searchedUser._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(
                                  searchedUser._id
                                )}
                                onChange={() =>
                                  handleSelectUser(searchedUser._id)
                                }
                              />
                            </td>
                            <td>
                              <div>
                                <img onClick={()=> handleNavUser(searchedUser._id)}
                                  src={searchedUser.profilePhoto}
                                  alt="profile"
                                />
                                <div>
                                  <h4 onClick={()=> handleNavUser(searchedUser._id)} >{searchedUser.name}</h4>
                                  <h5 onClick={()=> handleNavUser(searchedUser._id)} >{searchedUser.email}</h5>
                                </div>
                              </div>
                            </td>
                            
                            <td>
                              {deleteUser?._id === searchedUser?._id ? (
                                <div className="delete-user-confirm">
                                  <button onClick={()=>handleConfirmDeleteUser(deleteUser)}>
                                    Confirm
                                  </button>
                                  <button onClick={handleCancelDeleteUser}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() =>
                                    handleDeleteUser(searchedUser)
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
                  : displayedUsers.map((user, ind) => {
                    
                      return (
                        <>
                          <tr key={user._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleSelectUser(user._id)}
                              />
                            </td>
                            <td>
                              <div>
                                <img  onClick={()=> handleNavUser(user._id)} src={user.profilePhoto} alt="profile" />
                                <div>
                                  <h4 onClick={()=> handleNavUser(user._id)} >{user.name}</h4>
                                  <h5 onClick={()=> handleNavUser(user._id)} >{user.email}</h5>
                                </div>
                              </div>
                            </td>
                            
                            <td>
                              {deleteUser?._id === user?._id ? (
                                <div className="delete-user-confirm">
                                  <button onClick={()=>handleConfirmDeleteUser(deleteUser)}>
                                    Confirm
                                  </button>
                                  <button onClick={handleCancelDeleteUser}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => handleDeleteUser(user)}
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
            <h1>no users</h1>
          )}
        </table>
        {searchedEmail !=="" && searchedUsers.length === 0 ? null : users.length === 0 ? null : <Pagination
        searchedEmail={searchedEmail}
        searchedUsers={searchedUsers}
          itemsPerPage={itemsPerPage}
          displayedUsers={displayedUsers}
          users={users}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
     }
        
      </div>
    </>
  );
}

export default UsersTable;
