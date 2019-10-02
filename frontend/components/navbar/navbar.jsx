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
      <div>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    );
    return currentUser ? loggedIn() : loggedOut();

};

export default Navbar;