import React from 'react';

const FundInfo = ({ currentForm, errors, handleChange, state }) => {

  const isError = (field) => errors[field] ? true : false

  if (currentForm !== "FundInfo") return null;

  return (
    <>
      <h1 className="signup-header third-step">
        How much funds would you like to start off with?
        <br />
        Remember to only invest spare money!
      </h1>
      <div className="second-form-group">
        <div className="funds">
          <div className={`error-msg-${isError('funds')}`}>{errors.funds}</div>
          <input type="text"
            required
            className={`error-${isError('funds')}`}
            onChange={handleChange('funds')}
            placeholder="Funds"
            value={state.funds}
          />
        </div>
      </div>
    </>
  )
};

export default FundInfo;