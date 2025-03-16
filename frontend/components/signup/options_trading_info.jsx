import React from "react";
import { OPTIONS_TRADING_PREFERENCES, FORM_FIELDS } from "./util";

export const OptionsTradingInfo = () => (
  <>
    <img className="signup-stockflow-logo" src={window.stockflowLogo} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Answer a few questions about investing
      </div>
      <div className="information-section-details">
        To help you open a Robinhood account, we need to ask a few questions about you and your experience with investing.
      </div>
      <img className="signup-image" src={window.signupInvestingExperienceImage} />
    </div>
  </>
);

export const OptionsTradingInfoFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        Would you like to enable commission-free options trading once your account is approved?
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.keys(OPTIONS_TRADING_PREFERENCES).map((preference, idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FORM_FIELDS.OPTIONS_TRADING_PREFERENCE] === preference ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={preference}
                    checked={userInfo[FORM_FIELDS.OPTIONS_TRADING_PREFERENCE] === preference}
                    onChange={updateField(FORM_FIELDS.OPTIONS_TRADING_PREFERENCE)}
                  />
                  <span>{OPTIONS_TRADING_PREFERENCES[preference]}</span>
                </label>
              )
            })}
            {errors[FORM_FIELDS.OPTIONS_TRADING_PREFERENCE] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.OPTIONS_TRADING_PREFERENCE]}
            </div>}
          </div>
        </div>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer experience">
        Options are risky and aren't suitable for all investors. To learn about risks, read the options disclosure.
        Other fees may apply.
      </div>
    </div>
  </div>
);

export const optionsTradingValidations = {
  [FORM_FIELDS.OPTIONS_TRADING_PREFERENCE]: (optionsTrading) => {
    if (optionsTrading === null) {
      return 'Please select your options trading preference';
    };
  },
};
