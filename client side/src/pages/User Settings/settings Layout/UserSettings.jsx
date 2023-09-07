import React, { useState } from "react";
import "./usersettings.css";
import UserPosts from "../User Posts/UserPosts";
import UserComments from "../User Comments/UserComments";
import UserLikes from "../User Likes/UserLikes";
import UserInfo from "../User Info/UserInfo";
import ChangePassword from "../Change Password/ChangePassword";
import DeleteAccount from "../Delete Account/DeleteAccount";

function UserSettings() {
  const [isAsideShow, setIsAsideShow] = useState(false);
  const [userinfo, setUserInfo] = useState(true);
  const [changePassword, setChangePassword] = useState(false);
  const [userPosts, setUserPosts] = useState(false);
  const [userComments, setUserComments] = useState(false);
  const [userLikes, setUserLikes] = useState(false);
  const [deleteAccount , setDeleteAccount] = useState(false)

  const handleToggle = () => {
    setIsAsideShow(!isAsideShow);
  };

  const handleShowedlayout = () => {
    setUserInfo(false);
    setChangePassword(false);
    setUserPosts(false);
    setUserComments(false);
    setUserLikes(false);
    setDeleteAccount(false)
  };

  return (
    <div className="user-settings-cont">
      <div
        className={
          isAsideShow ? "user-settings-aside active" : "user-settings-aside"
        }
      >
        <div
          className={isAsideShow ? "burger-aside active" : "burger-aside"}
          onClick={handleToggle}
        >
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul>
          <li
            onClick={() => {
              handleShowedlayout();
              setUserInfo(true);
            }}
            className={userinfo ? "active" : ""}
          >
            user info
          </li>
          <li
            onClick={() => {
              handleShowedlayout();
              setChangePassword(true);
            }}
            className={changePassword ? "active" : ""}
          >
            change password
          </li>
          <li
            onClick={() => {
              handleShowedlayout();
              setUserPosts(true);
            }}
            className={userPosts ? "active" : ""}
          >
            posts
          </li>
          <li
            onClick={() => {
              handleShowedlayout();
              setUserComments(true);
            }}
            className={userComments ? "active" : ""}
          >
            comments
          </li>
          <li
            onClick={() => {
              handleShowedlayout();
              setUserLikes(true);
            }}
            className={userLikes ? "active" : ""}
          >
            likes
          </li>
          <li onClick={()=>{
            handleShowedlayout();
            setDeleteAccount(true);
          }}
            className={deleteAccount ? "active" : ""}
          >
            Delete Account
          </li>
        </ul>
      </div>
      <div className="user-settings-main">
        {userinfo && <UserInfo />}
        {changePassword && <ChangePassword />}
        {userPosts && <UserPosts />}
        {userComments && <UserComments />}
        {userLikes && <UserLikes />}
        {deleteAccount && <DeleteAccount />}
      </div>
    </div>
  );
}

export default UserSettings;
