import React from "react";
import { FAMILY_OPTIONS, FORM_FIELDS } from "./util";

export const FamilyInfo = () => (
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

export const FamilyInfoFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        Are you or a family member a senior executive or 10% shareholder at a publicly traded company?
      </div>
      <div className="form-section-info-sub-text">
        If you don't know what this means, it likely doesn't apply to you.
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.keys(FAMILY_OPTIONS).map((expLevel, idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FORM_FIELDS.FAMILY_STATUS] === expLevel ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={expLevel}
                    checked={userInfo[FORM_FIELDS.FAMILY_STATUS] === expLevel}
                    onChange={updateField(FORM_FIELDS.FAMILY_STATUS)}
                  />
                  <span>{FAMILY_OPTIONS[expLevel]}</span>
                </label>
              )
            })}
            {errors[FORM_FIELDS.FAMILY_STATUS] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.FAMILY_STATUS]}
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

export const familyValidations = {
  [FORM_FIELDS.FAMILY_STATUS]: (familyStatus) => {
    if (familyStatus.length <= 0) {
      return 'Please select your family details';
    };
  },
};
