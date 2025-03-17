import React, { useEffect, useState } from "react";
import LoginImage from './login-image';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../actions/session_actions";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const loginUser = () => {
    console.log({ email, password })
    dispatch(login({ email, password })).then(() => navigate("/dashboard"))
  }

  useEffect(() => {
    // Select all <g> elements whose transform matches our pattern
    const gElements = document.querySelectorAll('g[transform^="matrix(1,0,0,1,"]');
    const animatedItems = [];
    let sumX = 0, sumY = 0, count = 0;

    // Parse the initial transforms and store the original center for each element.
    gElements.forEach(g => {
      const transformStr = g.getAttribute("transform");
      // Expecting a format like: matrix(1,0,0,1,cx,cy)
      const match = transformStr.match(/matrix\(1,0,0,1,([-\d.]+),([-\d.]+)\)/);
      if (match) {
        const cx = parseFloat(match[1]);
        const cy = parseFloat(match[2]);
        animatedItems.push({ el: g, cx, cy });
        sumX += cx;
        sumY += cy;
        count++;
      }
    });

    if (count === 0) return; // nothing to animate

    // Compute a global center (for phase calculations)
    const globalCx = sumX / count;
    const globalCy = sumY / count;

    // Choose small oscillation amplitudes so elements don’t get jumbled.
    const rx = 20; // horizontal oscillation (adjust as needed)
    const ry = 10; // vertical oscillation
    const period = 4; // period in seconds for one full oscillation cycle

    // For each element, compute a phase offset based on its angle relative to the global center.
    animatedItems.forEach(item => {
      item.phase = Math.atan2(item.cy - globalCy, item.cx - globalCx);
    });

    const startTime = performance.now();

    function animate() {
      const now = performance.now();
      const t = (now - startTime) / 1000; // time in seconds
      const theta = (t % period) / period * 2 * Math.PI;

      animatedItems.forEach(item => {
        // Calculate a relative offset so that at time 0 the offset is zero.
        const offsetX = rx * (Math.cos(theta + item.phase) - Math.cos(item.phase));
        const offsetY = ry * (Math.sin(theta + item.phase) - Math.sin(item.phase));
        const newX = item.cx + offsetX;
        const newY = item.cy + offsetY;
        item.el.setAttribute("transform", `matrix(1,0,0,1,${newX},${newY})`);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  const handleEmail = (e) => setEmail(e.target.value)

  const handlePassword = (e) => setPassword(e.target.value)

  const handleCheckbox = (e) => setIsChecked(e.target.checked)

  const clearErrors = () => setErrors({ email: '', password: '' });

  const handleLoginClick = () => {
    console.log('Login Clicked')
    clearErrors();
    if (email.length < 1) { setErrors(prev => ({...prev, email: 'Please enter an email'})) }
    if (password.length < 1) { setErrors(prev => ({...prev, password: 'Please enter a password'})) }

    console.log({ email, password })
    loginUser()
  }

  const handleDemoUser = () => {
    clearErrors()
    setEmail('tonystark@email.com');
    setPassword('password')
    // loginUser()
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
            <label>
              <div className="email-label-text">Email {errors.email.length > 0 && <div className="session-error">{errors.email}</div>}</div>
              <input className="login-email-input" onChange={handleEmail} value={email} type="email" required />
            </label>

            <label>
              <div className="password-label-text">Password {errors.password.length > 0 && <div className="session-error">{errors.password}</div>}</div>
              <input className="login-password-input" onChange={handlePassword} value={password} type="password" required />
            </label>

            <label className="remember-checkbox-container">
              <div className="checkbox-label-text">Keep me logged in for up to 30 days</div>
              <input className="login-checkbox-input" onChange={handleCheckbox} checked={isChecked} type="checkbox" required />
            </label>

            {isChecked && 
              <div className="warning-message-container">
                <img className="warning-icon" src={window.warningIcon} />
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