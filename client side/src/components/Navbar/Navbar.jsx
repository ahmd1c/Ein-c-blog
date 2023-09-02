import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./nav.css";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logUserOut } from "../../store/userReducer";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dispatch(getUser());
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [userShow, setUserShow] = useState(false);

  const handleLogOut = () => {
    fetch("http://localhost:5000/api/v1/user/signOut", {
      credentials: "include",
    })
      .then(() => {
        dispatch(logUserOut());
        navigate("/signIn");
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleUserShow = () => {
    setUserShow(!userShow);
  };


  return (
    <nav>
      <div className="logo">
        <Link to="/">Ein-C</Link>
      </div>
      <ul  className={isOpen ? user.id === "" ? "active userout" : "active" : "" }>
        <div className="main-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts">posts</Link>
          </li>
          { user.id !== "" &&
          <li>
            <Link to="/createpost">create post</Link>
          </li>
          }
          { user.role === "admin" &&
          <li>
            <Link to="/admindashboard">Dashboard</Link>
          </li>
          }
        </div>
        <div className={user.id === "" ? "nav-user out" : "nav-user"}>
          {user.id === "" ? (
            <>
              <div>
                <Link to="/signUp">Sign up</Link>
              </div>
              <div>
                <Link to="/signIn">Login</Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="hello-user">
                 
                  <b className="nav-hide">Hello</b> <small className="nav-hide">{user.username}</small>{" "}
                  <img onClick={handleUserShow} alt="profile" src={user.profilePhoto} />
                </span>
              </div>
              <div className={userShow ? "nav-user-settings active" : "nav-user-settings"}>
                
                  <span className="nav-show">
                    {" "}
                    <b>Hello</b> <small>{user.username}</small>{" "}
                    </span>
                
                <Link to="/usersettings">
                  settings{" "}
                  <span className="material-symbols-outlined">settings</span>
                </Link>
                <Link onClick={handleLogOut} to="">
                  Logout <span className="material-symbols-outlined">logout</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </ul>
      <div
        className={isOpen ? "burger active" : "burger"}
        onClick={handleToggle}
      >
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
};

export default NavBar;
