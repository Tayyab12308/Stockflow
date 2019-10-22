import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    debugger
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDemo = this.handleDemo.bind(this);
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login(this.state).then(() => this.props.history.push("/dashboard"));
  }

  handleDemo() {
    const demoUser = {
      email: "tonystark@email.com",
      password: "password"
    };
    this.props.login(demoUser).then(()=> this.props.history.push("/dashboard"));
  }

  renderErrors() {
    debugger
    if (Object.values(this.props.errors).length > 0) { 
      return <div className="login-errors"><img className="error-icon" src={window.warningIcon}/> Unable to login with provided credentials</div>
    } else {
      return null
    }
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
              {this.renderErrors()}
              <button type="submit">Sign In </button>
            </form>
            <button onClick={this.handleDemo}>Demo User</button>
          </div>
        </div>
      </>
    )
  }
}

export default LoginForm;