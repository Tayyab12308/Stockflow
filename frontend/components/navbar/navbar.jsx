import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentUser, logout }) => {
    const loggedIn = () => (
      <div>
        <h2> Hi {currentUser.first_name}</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
    const loggedOut = () => (
      <div className="navbar-buttons">
        <div className="navbar-links">
          <Link to="/">Investing</Link>
          <Link to="/">Cash Management</Link>
          <Link to="/">Learn</Link>
          <Link to="/">More</Link>
        </div>
        <div className="navbar-session-buttons">
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    );
    return currentUser ? loggedIn() : loggedOut();

};

export default Navbar;