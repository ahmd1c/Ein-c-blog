import React, { useState } from "react";
import "./userprofile.css";
import UserPosts from "../User Settings/User Posts/UserPosts";
import photo from "../../assets/javier-miranda-MrWOCGKFVDg-unsplash.jpg";

function Userprofile() {
  const [isAsideShowProfile, setIsAsideShowProfile] = useState(false);
  const [userProfileInfo, setUserProfileInfo] = useState(true);
  const [userProfilePosts, setUserProfilePosts] = useState(false);

  const handleToggle = () => {
    setIsAsideShowProfile(!isAsideShowProfile);
  };

  const handleUserProfilelayout = () => {
    setUserProfileInfo(false);
    setUserProfilePosts(false);
  };

  return (
    <div className="user-profile-cont">
      <div
        className={
          isAsideShowProfile
            ? "user-settings-aside active"
            : "user-settings-aside"
        }
      >
        <div
          className={
            isAsideShowProfile ? "burger-aside active" : "burger-aside"
          }
          onClick={handleToggle}
        >
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul>
          <li
            onClick={() => {
              handleUserProfilelayout();
              setUserProfileInfo(true);
            }}
            className={userProfileInfo ? "active" : ""}
          >
            user info
          </li>
          <li
            onClick={() => {
              handleUserProfilelayout();
              setUserProfilePosts(true);
            }}
            className={userProfilePosts ? "active" : ""}
          >
            User Posts
          </li>
        </ul>
      </div>
          {userProfileInfo && // don't forget to add the navigation functionality
          <div className="user-profile-main">
          <div className="user-profile-upper">
            <img src={require("../../assets/default.png")} alt="" />
            <h2>name</h2>
          </div>
          <div className="user-profile-bio">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              natus, sunt perspiciatis modi iste ducimus ipsam, officia, odio nam
              voluptatibus nobis et ipsum sed dolorem velit nostrum quos esse.
              Minus?
            </p>
          </div>
        </div>
          }
      {userProfilePosts && <div className="user-posts-cont">
      <div className="post-box">
        
        <img src={photo} alt="" />
        <h3>one day one day one day</h3>
        <p>sadasdasdsadasdasdasdasdasdasd</p>
        <div className="details">
          <span>created at : 2213122312 </span>
          <span>author : dsadasda </span>
        </div>
      </div>
      <div className="post-box">
        
        <img src={photo} alt="" />
        <h3>one day one day one day</h3>
        <p>sadasdasdsadasdasdasdasdasdasd</p>
        <div className="details">
          <span>created at : 2213122312 </span>
          <span>author : dsadasda </span>
        </div>
      </div>
      <div className="post-box">
        
        <img src={photo} alt="" />
        <h3>one day one day one day</h3>
        <p>sadasdasdsadasdasdasdasdasdasd</p>
        <div className="details">
          <span>created at : 2213122312 </span>
          <span>author : dsadasda </span>
        </div>
      </div>
      <div className="post-box">
        
        <img src={photo} alt="" />
        <h3>one day one day one day</h3>
        <p>sadasdasdsadasdasdasdasdasdasd</p>
        <div className="details">
          <span>created at : 2213122312 </span>
          <span>author : dsadasda </span>
        </div>
      </div>
      <div className="post-box">
        
        <img src={photo} alt="" />
        <h3>one day one day one day</h3>
        <p>sadasdasdsadasdasdasdasdasdasd</p>
        <div className="details">
          <span>created at : 2213122312 </span>
          <span>author : dsadasda </span>
        </div>
      </div>
      <div className="post-box">
        
        <img src={photo} alt="" />
        <h3>one day one day one day</h3>
        <p>sadasdasdsadasdasdasdasdasdasd</p>
        <div className="details">
          <span>created at : 2213122312 </span>
          <span>author : dsadasda </span>
        </div>
      </div>
      </div>
      }
    </div>
  );
}

export default Userprofile;
