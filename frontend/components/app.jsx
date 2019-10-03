import React from 'react';
import NavbarContainer from './navbar/navbar_container'
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import SignUpContainer from '../components/session/signup/signup_form_container';
import LoginContainer from '../components/session/login_form_container';

const App = () => (
  <div>
    <header className="navbar">
      <nav className="nav-elements">
        <NavbarContainer />
      </nav>
    </header>
    <AuthRoute path="/signup" component={SignUpContainer} />
    <AuthRoute path="/login" component={LoginContainer}/>
  </div>
);

export default App;