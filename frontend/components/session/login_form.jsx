import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../actions/session_actions'; 

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })).then(() => navigate("/dashboard"));
  }

  const handleDemo = () => {
    dispatch(login({
      email: "tonystark@email.com",
      password: "password"
    })).then(() => navigate("/dashboard"));
  }

  return (
    <>
      <div className="login-page">
        <div>
          <img className="login_image" src={window.loginImage} />
        </div>
        <div className="form-section">
          <form onSubmit={handleSubmit} className="form-group">
            <p className="login-header">Welcome to Stockflow</p>
            <label>
              Email:
              <br />
              <input
                className="login-input"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </label>
            <label>
              Password:
              <br />
              <input
                className="login-input"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </label>
            {Object.values(errors).length > 0 && <div
              className="login-errors">
              <img className="error-icon" src={window.warningIcon} />
              Unable to login with provided credentials
            </div>}
            <button type="submit">Sign In </button>
          </form>
          <button onClick={handleDemo}>Demo User</button>
        </div>
      </div>
    </>
  )
}

export default LoginForm;