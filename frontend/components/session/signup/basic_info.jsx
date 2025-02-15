import React from 'react';

const BasicInfo = ({ currentForm, errors, handleChange, state }) => {

  const isError = (field) => errors[field] ? true : false

  if (currentForm !== "BasicInfo") return null;

  return (
    <>
      <h2 className="signup-header second-step">
        Welcome, <span className="signup-header-email">{state.email_address}</span> <br />
        Enter Your Contact Information
      </h2>
      <div className="second-form-group">
        <div className="address">
          <div className={`error-msg-${isError('address')}`}>{errors.address}</div>
          <input
            type="text"
            required
            className={`error-${isError('address')}`}
            onChange={handleChange('address')}
            placeholder="Address"
            value={state.address}
          />
        </div>
        <div className="phone-numbers">
          <div className={`error-msg-${isError('phone_number')}`}>{errors.phone_number}</div>
          <input
            type="text"
            required className={`error-${isError('phone_number')}`}
            onChange={handleChange('phone_number')}
            placeholder="Phone Number"
            value={state.phone_number}
          />
        </div>
      </div>
    </>
  )

};

export default BasicInfo;