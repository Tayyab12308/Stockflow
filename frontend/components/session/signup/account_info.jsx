import React from 'react';

class AccountInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  isError(field) {
    return this.props.errors[field] ? true : false
  }

  render () {
    if (this.props.currentForm !== "AccountInfo") return null;
    return (
      <>
        <div className="signup-container">
          <div className="form-container">
            <h2 className="signup-header">Make Your Money Move</h2>
            <h3 className="signup-sub-header">Stockflow lets you invest in companies you love, commission-free</h3>
            <div className="form-group">
              <div className="name">
                <div className="first-name">
                  <div className={`error-msg-${this.isError('first_name')}`}>{this.props.errors.first_name}</div>
                  <input type="text" className={`error-${this.isError('first_name')}`} required placeholder="First Name" onChange={this.props.handleChange('first_name')} value={this.props.state.first_name} width="200" />
                </div>
                <div className="last-name">
                  <div className={`error-msg-${this.isError('last_name')}`}>{this.props.errors.last_name}</div> 
                  <input type="text" className={`error-${this.isError('last_name')}`} required placeholder="Last Name" onChange={this.props.handleChange('last_name')} value={this.props.state.last_name} />
                </div>
              </div>
              <div className="email-address">
                <div className={`error-msg-${this.isError('email_address')}`}>{this.props.errors.email_address}</div>
                <input type="email" className={`error-${this.isError('email_address')}`} required placeholder="Email Address" onChange={this.props.handleChange('email_address')} value={this.props.state.email_address} />
              </div>
              <div className="password">
                <div className={`error-msg-${this.isError('password')}`}>{this.props.errors.password}</div>
                <input type="password" className={`error-${this.isError('password')}`} required placeholder="Password (min. 6 characters)" onChange={this.props.handleChange('password')} value={this.props.state.password} />
              </div>
            </div>
          </div>
          <div className="video-container">
            <img className="signup-gif" src={window.signupGIF} />
          </div>
        </div>
      </>
    )
  }
};

export default AccountInfo;