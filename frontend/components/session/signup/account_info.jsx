import React from 'react';

const AccountInfo = ({ currentForm, errors, handleChange, state }) => {

  const isError = (field) => errors[field] ? true : false

  if (currentForm !== "AccountInfo") return null;

  return (
    <>
      <div className="signup-container">
        <div className="form-container">
          <h2 className="signup-header">
            Make Your Money Move
          </h2>
          <h3 className="signup-sub-header">
            Stockflow lets you invest in companies you love, commission-free
          </h3>
          <div className="form-group">
            <div className="name">
              <div className="first-name">
                <div className={`error-msg-${isError('first_name')} tooltip-text`}>
                  {errors.first_name}
                </div>
                <input
                  type="text"
                  className={`error-${isError('first_name')} tooltip`}
                  required
                  placeholder="First Name"
                  onChange={handleChange('first_name')}
                  value={state.first_name}
                  width="200"
                />
              </div>
              <div className="last-name">
                <div className={`error-msg-${isError('last_name')}`}>
                  {errors.last_name}
                </div>
                <input
                  type="text"
                  className={`error-${isError('last_name')}`}
                  required
                  placeholder="Last Name"
                  onChange={handleChange('last_name')}
                  value={state.last_name}
                />
              </div>
            </div>
            <div className="email-address">
              <div className={`error-msg-${isError('email_address')}`}>
                {errors.email_address}
              </div>
              <input
                type="email"
                className={`error-${isError('email_address')}`}
                required
                placeholder="Email Address"
                onChange={handleChange('email_address')}
                value={state.email_address}
              />
            </div>
            <div className="password">
              <div className={`error-msg-${isError('password')}`}>{errors.password}</div>
              <input
                type="password"
                className={`error-${isError('password')}`}
                required
                placeholder="Password (min. 6 characters)"
                onChange={handleChange('password')}
                value={state.password}
              />
            </div>
          </div>
        </div>
        <div className="video-container">
          <img className="signup-gif" src={window.signupGIF} />
        </div>
      </div>
    </>
  )
};

export default AccountInfo;