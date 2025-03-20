import React from "react";
import { FormFields } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";


export const FundAccountDetails: React.FC = (): React.JSX.Element => (
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

export const FundAccounttDetailsFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content">
    <div className="form-fields-section">
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FormFields.funds] ? 'error-field' : ''}`}
          type="number"
          placeholder="Enter amount to fund account"
          value={userInfo[FormFields.funds]}
          onChange={(e) => {
            updateField(FormFields.funds)(e)
            updateField(FormFields.portfolioValue)(e)
          }}
        />
        {errors[FormFields.funds] && <div className="signup-form-field-error">
          {errors[FormFields.funds]}
        </div>}
      </div>
    </div>
  </div>
);

export const fundAccountDetailsValidations = {}