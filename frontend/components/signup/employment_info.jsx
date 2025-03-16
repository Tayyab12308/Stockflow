import React from "react";
import { EMPLOYMENT_OPTIONS, FORM_FIELDS } from "./util";

export const EmploymentInfo = () => (
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

export const EmploymentInfoFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        Are you employed?
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.keys(EMPLOYMENT_OPTIONS).map((expLevel, idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FORM_FIELDS.EMPLOYMENT_STATUS] === expLevel ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={expLevel}
                    checked={userInfo[FORM_FIELDS.EMPLOYMENT_STATUS] === expLevel}
                    onChange={updateField(FORM_FIELDS.EMPLOYMENT_STATUS)}
                  />
                  <span>{EMPLOYMENT_OPTIONS[expLevel]}</span>
                </label>
              )
            })}
            {errors[FORM_FIELDS.EMPLOYMENT_STATUS] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.EMPLOYMENT_STATUS]}
            </div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const employmentValidations = {
  [FORM_FIELDS.EMPLOYMENT_STATUS]: (employmentStatus) => {
    if (employmentStatus.length <= 0) {
      return 'Please select your employment status';
    };
  },
};
