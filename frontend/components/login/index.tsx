import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../actions/session_actions";
import LoginImage from './LoginImage';
import useAnimatedSVG from "./useAnimatedSVG";
import { UserSessionDetails } from "../../interfaces";
import LoginInput from "./LoginInput";
import LoginCheckbox from "./LoginCheckbox";
import type { AppDispatch } from "../../store";

const Login = () => {
  useAnimatedSVG();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ emailAddress: string, password: string}>({
    emailAddress: '',
    password: '',
  });

  const loginUser = () => {
    const loginCredentials: UserSessionDetails = { emailAddress, password };
    dispatch(login(loginCredentials)).then(() => navigate("/dashboard"))
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmailAddress(e.target.value);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked);

  const clearErrors = () => setErrors({ emailAddress: '', password: '' });

  const handleLoginClick = () => {
    clearErrors();
    if (emailAddress?.length < 1) { setErrors(prev => ({...prev, email: 'Please enter an email'})) }
    if (password?.length < 1) { setErrors(prev => ({...prev, password: 'Please enter a password'})) }

    loginUser()
  }

  const handleDemoUser = () => {
    clearErrors()
    setEmailAddress('tonystark@email.com');
    setPassword('password')
  }

  return (
    <div className="login-page-content">
      <div className="login-image">
        <LoginImage />
      </div>
      <div className="login-form-container">
        <div className="login-form-floating-box">
          <div className="login-message">Log in to Stockflow</div>
          <div className="login-form-fields">
            <LoginInput label="Email" type="email" value={emailAddress} onChange={handleEmail} error={errors.emailAddress} />
            <LoginInput label="Password" type="password" value={password} onChange={handlePassword} error={errors.password} />
            <LoginCheckbox checked={isChecked} onChange={handleCheckbox} />

            {isChecked && 
              <div className="warning-message-container">
                <img className="warning-icon" src={window.warningIcon} alt="Warning Icon"/>
                <div className="warning-text">Only select this option if you trust this device and are not logging on from a shared computer.</div>
              </div>
            }
          </div>

          <div className="button-container">
            <div className="login-help-buttons">
              <button className="stockflow-button login-action-button" onClick={handleLoginClick}>Log In</button>
              <button className="stockflow-button help-button">I Need Help</button>
            </div>
          </div>
          <div className="separator-text">
            <div className="gray-dash"></div>
            <div className="or-text">or</div>
            <div className="gray-dash"></div>
          </div>
          <button className="stockflow-button demo-button" onClick={handleDemoUser}>Login With Demo</button>
          <div className="signup-redirect-text">
            Not on Stockflow?
            <Link className="signup-redirect-link" to="/signup">Create an Account</Link>
          </div>
          <div className="site-protection-disclaimer">This site is protected by reCaptcha and Privacy Policy. Terms of Service Apply</div>
        </div>
      </div>
    </div>
  )
}


export default Login;