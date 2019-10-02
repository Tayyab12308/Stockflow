import React from 'react';
import NavbarContainer from './navbar/navbar_container'
import { Link} from 'react-router-dom';

const App = () => (
  <div>
    <header className="navbar">
      <nav className="nav-elements">
        <Link to="/" className="navbar-logo"><h1>stockflow</h1></Link>
        <NavbarContainer />
      </nav>
    </header>
  </div>
);

export default App;