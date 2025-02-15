import React from 'react';

const SubmitInfo = ({ currentForm, state, handlePrevious }) => {

  if (currentForm !== "SubmitInfo") return null;

  return (
    <>
      <h1 className="signup-header submit-info-header">
        Please make sure your information is correct
      </h1>
      <div className="all-info">
        <div className="account-info">
          <div className="account-text">
            <h1 className="signup-sub-header">
              First Name: {state.first_name}
            </h1>
            <h1 className="signup-sub-header">
              Last Name: {state.last_name}
            </h1>
            <h1 className="signup-sub-header">
              Email Address: {state.email_address}
            </h1>
          </div>
          <div className="button-container">
            <button
              className="prev-button"
              onClick={() => handlePrevious("AccountInfo")}
            >
              Edit Account Info
            </button>
          </div>
        </div>
        <div className="basic-info">
          <div className="basic-text">
            <h1 className="signup-sub-header">
              Address: {state.address}
            </h1>
            <h1 className="signup-sub-header">
              Phone Number: {state.phone_number}
            </h1>
          </div>
          <div className="button-container">
            <button
              className="prev-button"
              onClick={() => handlePrevious("BasicInfo")}
            >
              Edit Basic Info
            </button>
          </div>
        </div>
        <div className="fund-info">
          <div className="fund-text">
            <h1 className="signup-sub-header">
              Funds: {state.funds}
            </h1>
          </div>
          <div className="button-container">
            <button className="prev-button"
              onClick={() => handlePrevious("FundInfo")}
            >
              Edit Fund Info
            </button>
          </div>
        </div>
      </div>
      <div>
        <button className="signup-submit-button" value="Sign Up">Sign Up</button>
      </div>
    </>
  )

}

export default SubmitInfo;