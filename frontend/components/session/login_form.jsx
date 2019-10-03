import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login(this.state);
  }

  render() {
    return (
      <>
        <div className="login-page">
          <div>
            <img className="login_image" src={window.loginImage} />
          </div>
          <div className="form-section">
            <form onSubmit={this.handleSubmit} className="form-group">
            <p className="login-header">Welcome to Stockflow</p>
              <label>
                Email:
                <br />
                <input className="login-input" type="email" required onChange={this.handleChange('email')} value={this.state.email}/>
              </label>
              <label>
                Password: 
                <br />
                <input className="login-input" type="password" required onChange={this.handleChange('password')} value={this.state.password}/>
              </label>
              <button type="submit">Sign In </button>
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default LoginForm;