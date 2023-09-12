import React, { useState } from "react";
import "./adminDashboard.css";
import UsersTable from "../Users Table/UsersTable"
import PostsTable from "../Posts Table/PostsTable";
import CommentsTable from "../Comments Table/CommentsTable";
import Chart from "./Chart";
import LowerCharts from "./lowerCharts";

function AdminDashboard() {
  const [adminDash, setAdminDash] = useState(true);
  const [adminUsers, setAdminUsers] = useState(false);
  const [adminPosts, setAdminPosts] = useState(false);
  const [adminComments, setAdminComments] = useState(false);
  const [adminModal , setAdminModal] = useState(false)

  const handleShowedlayout = () => {
    setAdminDash(false);
    setAdminUsers(false);
    setAdminPosts(false);
    setAdminComments(false);
  };

  return (
    <>
    {adminModal ? (
        <div className="admin-modal">
          <div className="admin-popup">
            
          </div>
        </div>
      ) : null}
    <div className="admin-cont">
      <div className="admin-aside">
        <div className="admin-aside-items-cont">
        <div className="admin-aside-item">
          <span onClick={()=>{
            handleShowedlayout()
            setAdminDash(true)
          }} className="material-symbols-outlined">grid_view</span>
          <h5 onClick={()=>{
            handleShowedlayout()
            setAdminDash(true)
          }} >dashboard</h5>
        </div>
        <div  className="admin-aside-item">
          <span onClick={()=>{
            handleShowedlayout()
            setAdminUsers(true)
          }} className="material-symbols-outlined">group</span> 
          <h5 onClick={()=>{
            handleShowedlayout()
            setAdminUsers(true)
          }} >users</h5>
        </div>
        <div className="admin-aside-item">
          <span onClick={()=>{
            handleShowedlayout()
            setAdminPosts(true)
          }} className="material-symbols-outlined">post</span> 
          <h5 onClick={()=>{
            handleShowedlayout()
            setAdminPosts(true)
          }} >posts</h5>
        </div>
        <div className="admin-aside-item">
          <span onClick={()=>{
            handleShowedlayout()
            setAdminComments(true)
          }} className="material-symbols-outlined">forum</span>
          <h5 onClick={()=>{
            handleShowedlayout()
            setAdminComments(true)
          }} >comments</h5>
        </div>
        </div>
      </div>
      {adminDash && 
      <div className="admin-dashboard-cont">
        <div className="totals">
          <div className="total-users">
            <h3>Total Users</h3>
            <h4>232</h4>
          </div>
          <div className="total-posts">
            <h3>Total Posts</h3>
            <h4>134</h4>
          </div>
          <div className="total-comments">
            <h3>Total Comments</h3>
            <h4>3425</h4>
          </div>
          <div className="total-likes">
            <h3>Total Likes</h3>
            <h4>10323</h4>
          </div>
        </div>
        <div className="charts-cont">
            <Chart />
            <LowerCharts />
        </div>
      </div>
      }
      {adminUsers && <UsersTable />}
      {adminPosts && <PostsTable />}
      {adminComments && <CommentsTable />}
    </div>
    </>
  );
}

export default AdminDashboard;
