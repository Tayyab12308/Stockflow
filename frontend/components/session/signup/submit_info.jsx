import React from 'react';

class SubmitInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.currentForm !== "SubmitInfo") return null;
    return (
      <>
      <h1 className="signup-header submit-info-header">Please make sure your information is correct</h1>
      <div className="all-info">
        <div className="account-info">
          <div className="account-text">
            <h1 className="signup-sub-header">First Name: {this.props.state.first_name}</h1>
            <h1 className="signup-sub-header">Last Name: {this.props.state.last_name}</h1>
            <h1 className="signup-sub-header">Email Address: {this.props.state.email_address}</h1>
          </div>
          <div className="button-container">
            <button onClick={() => this.props.handlePrevious("AccountInfo")}>Edit Account Info</button>
          </div>
        </div>
        <div className="basic-info">
          <div className="basic-text">
            <h1 className="signup-sub-header">Address: {this.props.state.address}</h1>
            <h1 className="signup-sub-header">Phone Number: {this.props.state.phone_number}</h1>
          </div>
          <div className="button-container">
            <button onClick={() => this.props.handlePrevious("BasicInfo")}>Edit Basic Info</button>
          </div>
        </div>
        <div className="fund-info">
          <div className="fund-text">
            <h1 className="signup-sub-header">Funds: {this.props.state.funds}</h1>
          </div>
          <div className="button-container">
            <button onClick={() => this.props.handlePrevious("FundInfo")}>Edit Fund Info</button>
          </div>
        </div>
      </div>
      <div>
        <button className="submit-button" value="Sign Up">Sign Up</button>
      </div>
      </>
    )
  }
}

export default SubmitInfo;