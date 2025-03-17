import React from "react";
import { FORM_FIELDS } from "./util";


export const FundAccounttDetails = () => (
  <>
    <img className="signup-stockflow-logo" src={window.stockflowLogo} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Fund your account
      </div>
      <div className="information-section-details">
        Link your bank account and transfer funds to get more out of Robinhood. It's secure, quick,
        and easy to start with an amount that works for you.
      </div>
      <img className="signup-image" src={window.signupFundAccountImage} />
    </div>
  </>
);

export const FundAccounttDetailsFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content">
    <div className="form-fields-section">
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FORM_FIELDS.FUNDS] ? 'error-field' : ''}`}
          type="number"
          placeholder="Enter amount to fund account"
          value={userInfo[FORM_FIELDS.FUNDS]}
          onChange={(e) => {
            updateField(FORM_FIELDS.FUNDS)(e)
            updateField(FORM_FIELDS.PORTFOLIO_VALUE)(e)
          }}
        />
        {errors[FORM_FIELDS.FUNDS] && <div className="signup-form-field-error">
          {errors[FORM_FIELDS.FUNDS]}
        </div>}
      </div>
    </div>
  </div>
);

export const fundAccountDetailsValidations = {}