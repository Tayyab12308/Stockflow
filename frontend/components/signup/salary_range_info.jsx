import React from "react";
import { INCOME_RANGE_OPTIONS, FORM_FIELDS } from "./util";

export const SalaryRangeInfo = () => (
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

export const SalaryRangeInfoFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
      What's your yearly income?
      </div>
      <div className="form-section-info-sub-text">
      Think about all your income sources, including salary, tips, or pension.
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.keys(INCOME_RANGE_OPTIONS).map((expLevel, idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FORM_FIELDS.SALARY_RANGE] === expLevel ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={expLevel}
                    checked={userInfo[FORM_FIELDS.SALARY_RANGE] === expLevel}
                    onChange={updateField(FORM_FIELDS.SALARY_RANGE)}
                  />
                  <span>{INCOME_RANGE_OPTIONS[expLevel]}</span>
                </label>
              )
            })}
            {errors[FORM_FIELDS.SALARY_RANGE] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.SALARY_RANGE]}
            </div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const salaryRangeValidations = {
  [FORM_FIELDS.SALARY_RANGE]: (salaryRange) => {
    if (salaryRange.length <= 0) {
      return 'Please select your salary range';
    };
  },
};
