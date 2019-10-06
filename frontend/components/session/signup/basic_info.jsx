import React from 'react';

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  isError(field) {
    return this.props.errors[field] ? true : false
  }
  
  render() {
    if (this.props.currentForm !== "BasicInfo") return null;
    return (
      <>
        <h2 className="signup-header second-step">Welcome, <span className="signup-header-email">{this.props.state.email_address}</span> <br/>
        Enter Your Contact Information</h2>
        <div className="second-form-group">
          <div className="address">
            <div className={`error-msg-${this.isError('address')}`}>{this.props.errors.address}</div>
            <input type="text" required className={`error-${this.isError('address')}`} onChange={this.props.handleChange('address')} placeholder="Address" value={this.props.state.address}/>
          </div>
          <div className="phone-numbers">
            <div className={`error-msg-${this.isError('phone_number')}`}>{this.props.errors.phone_number}</div>
            <input type="text" required className={`error-${this.isError('phone_number')}`} onChange={this.props.handleChange('phone_number')} placeholder="Phone Number" value={this.props.state.phone_number}/>
          </div>
        </div>
      </>
    )
  }
};

export default BasicInfo;