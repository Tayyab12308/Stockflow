import React from "react";
import { EXPERIENCE_OPTIONS, FORM_FIELDS } from "./util";

export const ExperienceInfo = () => (
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

export const ExperienceInfoFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        How much investment experience do you have?
      </div>
      <div className="form-section-info-sub-text">
        We're legally required to collect this information.
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.keys(EXPERIENCE_OPTIONS).map((expLevel, idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FORM_FIELDS.INVESTING_EXPERIENCE] === expLevel ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={expLevel}
                    checked={userInfo[FORM_FIELDS.INVESTING_EXPERIENCE] === expLevel}
                    onChange={updateField(FORM_FIELDS.INVESTING_EXPERIENCE)}
                  />
                  <span>{EXPERIENCE_OPTIONS[expLevel]}</span>
                </label>
              )
            })}
            {errors[FORM_FIELDS.INVESTING_EXPERIENCE] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.INVESTING_EXPERIENCE]}
            </div>}
          </div>
        </div>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer experience">
        All investments involve risk and loss of principal is possible.
      </div>
      <div className="disclaimers-footer experience">
        Stockflow Financial LLC (member SIPC), is a registered broker dealer.
        Stockflow Securities, LLC (member SIPC), is a registered broker dealer and provides
        brokerage clearing services. All are subsidiaries of Stockflow Markets, Inc.
      </div>
    </div>
  </div>
);

export const experienceValidations = {
  [FORM_FIELDS.INVESTING_EXPERIENCE]: (investingExperience) => {
    if (investingExperience.length <= 0) {
      return 'Please select your experience level';
    };
  },
};
