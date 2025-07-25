import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import BlackButton from './components/blackbutton'; // adjust the path as needed


const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <div className="social-login">
          <button className="google-btn">Continue with Google</button>
          <button className="facebook-btn">Continue with Facebook</button>
        </div>

        <div className="divider">OR</div>

        <form className="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <BlackButton type="submit" className="login-btn">Login</BlackButton>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
