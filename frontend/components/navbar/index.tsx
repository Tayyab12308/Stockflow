import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../actions/session_actions';
import LinkDropdown from '../linkDropdown';
import { RootState } from '../../reducers/root_reducer';
import { User } from '../../interfaces';
import { AppDispatch } from '../../store';
import SearchDropdown from '../searchDropdown';
import { SearchResult } from '../searchDropdown/searchDropdown.interfaces';
import { searchStock } from '../../util/stock_api_util';
import { DropdownTitle, DropdownItem } from '../linkDropdown/link_dropdown.interfaces';
import assetService from '../../services/assetService';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser: User | null = useSelector((state: RootState) => {
    const userId = state.session.id;
    return userId && state.entities.users[userId] ? state.entities.users[userId] : null;
  }, shallowEqual);
  
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const handleLogout = () => dispatch(logoutUser()).then(() => navigate("/"));
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleResultSelected = (res: SearchResult) => navigate(`/stock/${res.symbol}`);

  const loggedIn = () => {
    const title: DropdownTitle = {
      label: "Account", injectedClassName: 'navbar-link logged-in'
    }

    const dropdownItems: DropdownItem[] = [
      { label: "Profile", path: "/profile", injectedClassName: 'navbar-link' },
      { label: "Logout", path: "", injectedClassName: 'navbar-link', onClick: handleLogout },
    ]

    return (
      <>
        <nav className='nav-elements'>
          <div className="navbar-left-fixed logged-in">
            <div className="navbar-logo">
              <Link to="/dashboard"><img className="logged-in-logo-image" src={assetService.getImage('stockflowIcon')} /></Link>
            </div>
            <div className='navbar-search-container'>
              <SearchDropdown
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onResultSelected={handleResultSelected}
                clearOnSelect={true}
                searchBarClassName="sign-up-form-input search-bar"
                searchFunction={searchStock}
              />
            </div>
          </div>
          <div className="navbar-links logged-in-links" id="nav-log-in-links">
            <Link to="/rewards" className="navbar-link">Rewards</Link>
            <Link to="/investing" className="navbar-link">Investing</Link>
            <Link to="/crypto" className="navbar-link">Crypto</Link>
            <Link to="/spending" className="navbar-link">Spending</Link>
            <Link to="/retirement" className="navbar-link">Retirement</Link>
            <Link to="/transactions" className="navbar-link">Transactions</Link>
            <LinkDropdown
              title={title}
              items={dropdownItems}
            />
          </div>
          <div className="hamburger-container">
            <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
          </div>
        </nav>
        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="menu-links">
          <Link to="/rewards" className="menu-link">Rewards</Link>
            <Link to="/investing" className="menu-link">Investing</Link>
            <Link to="/crypto" className="menu-link">Crypto</Link>
            <Link to="/spending" className="menu-link">Spending</Link>
            <Link to="/retirement" className="menu-link">Retirement</Link>
            <Link to="/transactions" className="menu-link">Transactions</Link>
            <Link to="" onClick={handleLogout} className="menu-link">Logout</Link>
          </div>
        </div>
      </>
    )
  };



  const loggedOut = () => {
    const title: DropdownTitle = {
      label: 'What We Offer', injectedClassName: 'navbar-link'
    };
    const items: DropdownItem[] = [
      { label: 'Invest', path: '/invest', injectedClassName: 'navbar-link' },
      { label: 'Crypto', path: '/crypto', injectedClassName: 'navbar-link' },
      { label: 'Retirement', path: '/retirement', injectedClassName: 'navbar-link' },
      { label: 'Options', path: '/options', injectedClassName: 'navbar-link' },
      { label: 'Futures', path: '/futures', injectedClassName: 'navbar-link' },
    ];

    return (
      <>
        <nav className="nav-elements">
          <div className="navbar-left-fixed">
            <Link to="/">
              <img className="logo-image navbar-link" src={assetService.getImage('stockflowLogo')} />
            </Link>
            <div className="navbar-links">
              <LinkDropdown title={title} items={items} />
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