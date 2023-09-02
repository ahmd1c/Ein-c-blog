import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import NavBar from "./components/Navbar/Navbar.jsx";
import Posts from "./pages/Posts/Posts.jsx";
import Login from "./pages/Login/Login.jsx";
import Post from "./pages/Single Post/Post/Post.jsx";
import Createpost from "./pages/Create Post/Createpost.jsx";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.jsx";
import Userprofile from "./pages/User Profle/Userprofile.jsx";
import Signup from "./pages/Sign up/Signup.jsx";
import UserSettings from "./pages/User Settings/settings Layout/UserSettings.jsx";
import { getUser } from "./store/userReducer";
function App() {
  
  const dispatch = useDispatch();
  dispatch(getUser())
  const user = useSelector((state)=>state.user) 

  return (
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/signIn" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/user/:user" element={<Userprofile />}/>
      {user && 
        <>
          <Route path="/createpost" element={<Createpost />}/>
          <Route path="/usersettings" element={<UserSettings />}/>
        </>
      }
      {(user && user.role==="admin") && 
        <Route path="/admindashboard" element={<AdminDashboard />}/>
      }
      <Route path="/posts" element={<Posts />}/>
      <Route path="/post/:post" element={<Post />}/>
      
    </Routes>
    </BrowserRouter>
  );
}

export default App;
