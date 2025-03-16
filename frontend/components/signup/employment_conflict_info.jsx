import React from "react";
import { EMPLYMENT_CONFLICT_OPTIONS, FORM_FIELDS } from "./util";

export const EmploymentConflictInfo = () => (
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

export const EmploymentConflictFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        Do you or any of your family members work for a stock exchange or brokerage?
      </div>
      <div className="form-section-info-sub-text">
        If you don't know what this means, it likely doesn't apply to you.
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.keys(EMPLYMENT_CONFLICT_OPTIONS).map((expLevel, idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FORM_FIELDS.EMPLOYMENT_CONFLICT] === expLevel ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={expLevel}
                    checked={userInfo[FORM_FIELDS.EMPLOYMENT_CONFLICT] === expLevel}
                    onChange={updateField(FORM_FIELDS.EMPLOYMENT_CONFLICT)}
                  />
                  <span>{EMPLYMENT_CONFLICT_OPTIONS[expLevel]}</span>
                </label>
              )
            })}
            {errors[FORM_FIELDS.EMPLOYMENT_CONFLICT] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.EMPLOYMENT_CONFLICT]}
            </div>}
          </div>
        </div>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer experience">
        Stockflow is required by law to collect this information to help prevent insider trading.
      </div>
    </div>
  </div>
);

export const employmentConflictValidations = {
  [FORM_FIELDS.EMPLOYMENT_CONFLICT]: (familyStatus) => {
    if (familyStatus.length <= 0) {
      return 'Please select your family details';
    };
  },
};
