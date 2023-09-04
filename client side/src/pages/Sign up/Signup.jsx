import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userReducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setrepeatPassword] = useState("");

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      password !== repeatPassword
    ) return toast.error("please fill the required fields")
      
    try {
      const response = await fetch("http://localhost:5000/api/v1/user/createNewUser", {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name : username,
          email: email,
          password: password,
          repeatPassword : repeatPassword,
        }),
      });
      const data = await response.json();
      if(data.state === "success"){
        dispatch(setUser(data.data?.name));
        toast.success("You are successfully signed up")
        navigate('/' , {replace : true})
      }
    } catch (error) {
      toast.error("something went wrong")
    }
  };
  return (
    <>
    <ToastContainer />
    <div className="signup-cont">
      <form onSubmit={handleSignUpSubmit}>
        <div className="signup-username">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            id="username"
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="signup-password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
            id="password"
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="signup-repeat-password">
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setrepeatPassword(e.target.value)}
            name="repeatPassword"
            required
            id="repeat-Password"
          />
          <label htmlFor="repeat-Password">Repeat password</label>
        </div>
        <div className="signup-email">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email"
            id="email"
          />
          <label htmlFor="email">Email</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </>
  );
}

export default Signup;
