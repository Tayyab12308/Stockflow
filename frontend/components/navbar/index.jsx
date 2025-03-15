import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/session_actions';
import LinkDropdown from '../link_dropdown';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.entities.users[state.session.id]);
  const handleLogout = () => dispatch(logout()).then(() => navigate("/"));

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  const loggedIn = () => (
    <>
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/dashboard"><img className="logo-image transition-logo" src={window.stockflowDarkLogo} /></Link>
        </div>
        <div>
          {/* <Search className="search-bar" /> */}
        </div>
      </div>
      <div className="navbar-links logged-in-links" id="nav-log-in-links">
        <Link to="/">Home</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/">Account</Link>
        <Link to="" onClick={handleLogout}>Logout</Link>
      </div>
    </>
  );



  const loggedOut = () => {
    const dropdownItems = {
      title: {
        label: 'What We Offer', injectedClassName: 'navbar-link'
      },
      items: [
      { label: 'Invest', path: '/invest', injectedClassName: 'navbar-link' },
      { label: 'Crypto', path: '/crypto', injectedClassName: 'navbar-link' },
      { label: 'Retirement', path: '/retirement', injectedClassName: 'navbar-link' },
      { label: 'Options', path: '/options', injectedClassName: 'navbar-link' },
      { label: 'Futures', path: '/futures', injectedClassName: 'navbar-link' },
    ]}

    return (
      <>
      <nav className="nav-elements">
          <div className="navbar-left-fixed">
            <Link to="/">
              <img className="logo-image navbar-link" src={window.stockflowLogo} />
            </Link>
            <div className="navbar-links">
              <LinkDropdown dropdownItems={dropdownItems} />
              <Link className="navbar-link" to="/creditcard">Credit Card</Link>
              <Link className="navbar-link" to="/gold">Gold</Link>
              <Link className="navbar-link" to="/legend">Stockflow Legend</Link>
              <Link className="navbar-link" to="/learn">Learn</Link>
              <Link className="navbar-link" to="/support">Support</Link>
            </div>
          </div>
          <div className="navbar-session-buttons">
            <Link className="login-button" to="/login">Log In</Link>
            <Link className="signup-button" to="/signup">Sign Up</Link>
          </div>
          <div className="hamburger-container">
            <Link className="signup-button" to="/signup">Sign Up</Link>
            <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
          </div>
        </nav>
        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="menu-links">
            <Link className="menu-link" to="/invest">Invest</Link>
            <Link className="menu-link" to="/crypto">Crypto</Link>
            <Link className="menu-link" to="/retirement">Retirement</Link>
            <Link className="menu-link" to="/options">Options</Link>
            <Link className="menu-link" to="/futures">Futures</Link>
            <Link className="menu-link" to="/creditcard">Credit Card</Link>
            <Link className="menu-link" to="/gold">Gold</Link>
            <Link className="menu-link" to="/legend">Stockflow Legend</Link>
            <Link className="menu-link" to="/learn">Learn</Link>
            <Link className="menu-link" to="/support">Support</Link>
            <Link className="menu-link" to="/login">Log In</Link>
          </div>
        </div>
      </>
    )
  };
  
  return (
    <>
      <header className="navbar">
        {currentUser ? loggedIn() : loggedOut()}
      </header>  
    </>
  )
};

export default Navbar;