// src/components/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../login.css";
import image from "../logo.jpg";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user  && !user.emailVerified) {
        await sendEmailVerification(user); //dont forget to delete this line after dev
        setMessage('Login failed: Email not verified');
        return;
      }

      // Trigger login success
      onLoginSuccess();

      // Redirect to the inventory page
      navigate('./chemicalinventory');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        setMessage('Incorrect username or password');
      } else {
        setMessage(`Login failed: ${errorMessage}`);
      }

      console.error('Login failed:', errorCode, errorMessage);
    }
  };

  return (
    <div className="center-wrapper">
      <img src = {image} alt = "Umaine logo"></img>
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
