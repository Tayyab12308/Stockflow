import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentUser, logout }) => {
    const loggedIn = () => (
      <div className="navbar-links">
        <Link to="/">Free Stock</Link>
        <Link to="/">Home</Link>
        <Link to="/">Messages</Link>
        <Link to="/">Account</Link>
        <Link to="" onClick={logout}>Logout</Link>
      </div>
    );
    const loggedOut = () => (
      <>
        <Link to="/" className="navbar-logo"><h1>stockflow</h1></Link>
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
      </>
    );
    return currentUser ? loggedIn() : loggedOut();

};

export default Navbar;