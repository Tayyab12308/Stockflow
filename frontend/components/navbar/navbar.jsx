import React from 'react';
import { Link } from 'react-router-dom';
import Search from '../search_bar/search_container'

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      display: true
    }
  }

  handleBlur() {
    e => this.setState({ display: !(this.state.display)})
  }

  render() {
    const { currentUser, logout } = this.props;
    const loggedIn = () => (
      <>
        <div className="navbar-logo">
          <Link to="/dashboard"><img className="logo-image" src={window.stockflowDarkLogo} /></Link>
        </div>
        <div>
          <Search onBlur={this.handleBlur()} className={`search-bar-${this.state.display}`} />
        </div>
        <div className="navbar-links logged-in-links" id="nav-log-in-links">
          <Link to="/">Free Stock</Link>
          <Link to="/">Home</Link>
          <Link to="/">Messages</Link>
          <Link to="/">Account</Link>
          <Link to="" onClick={logout}>Logout</Link>
        </div>
      </>
    );
    const loggedOut = () => (
      <>
        <div className="navbar-right">
          <Link to="/"><img className="logo-image" src={window.stockflowLogo} /></Link>
          <Link to="/" className="navbar-logo">tockflow</Link>
        </div>
        <div className="navbar-buttons">
          <div className="navbar-links">
            <Link to="/">Investing</Link>
            <Link to="/">Cash Management</Link>
            <Link to="/">Learn</Link>
            <Link to="/">More</Link>
          </div>
          <div className="navbar-session-buttons">
            <Link to="/login">Log In</Link>
            <Link className="signup-button" to="/signup">Sign Up</Link>
          </div>
        </div>
      </>
    );
    return (
      <>
      <header className="navbar" id="navbar-component">
        <nav className="nav-elements">
          {currentUser ? loggedIn() : loggedOut()}
          </nav>
        </header>
      </>
    )
  }
};

export default Navbar;