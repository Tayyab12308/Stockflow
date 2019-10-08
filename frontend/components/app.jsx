import React from 'react';
import NavbarContainer from './navbar/navbar_container'
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Route } from 'react-router-dom';
import SignUpContainer from '../components/session/signup/signup_form_container';
import LoginContainer from '../components/session/login_form_container';
import SplashComponent from './splash';
import DashboardContainer from './dashboard/dashboard_container';
import StockShowContainer from './stock_show/stock_show_container';


const App = () => (
  <div>
    <Route exact path={["/", "/dashboard", "/stock/:ticker"]} component={NavbarContainer}/>
    <AuthRoute path="/signup" component={SignUpContainer} />
    <AuthRoute path="/login" component={LoginContainer}/>
    <Route exact path="/" component={SplashComponent} />
    <ProtectedRoute path="/dashboard" component={DashboardContainer} />
    <ProtectedRoute path="/stock/:ticker" component={StockShowContainer} />
  </div>
);

export default App;