import React from "react";
import { EMPLOYMENT_CONFLICT_OPTIONS, FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const EmploymentConflictInfo: React.FC = (): React.JSX.Element => (
  <>
    <img className="signup-stockflow-logo" src={assetService.getImage('stockflowLogo')} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Answer a few questions about investing
      </div>
      <div className="information-section-details">
        To help you open a Robinhood account, we need to ask a few questions about you and your experience with investing.
      </div>
      <img className="signup-image" src={assetService.getImage('signupInvestingExperienceImage')} />
    </div>
  </>
);

export const EmploymentConflictFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
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
            {Object.entries(EMPLOYMENT_CONFLICT_OPTIONS).map(([option, label], idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FormFields.employmentConflict] === option ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={option}
                    checked={userInfo[FormFields.employmentConflict] === option}
                    onChange={updateField(FormFields.employmentConflict)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
            {errors[FormFields.employmentConflict] && <div className="signup-form-field-error">
              {errors[FormFields.employmentConflict]}
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

export type ContactInfoValidation = {
  [key in keyof Pick<FormFieldsType, 'employmentConflict'>]: (value: string) => string | undefined;
};

export const employmentConflictValidations = {
  employmentConflict: (employmentConflict: string) => {
    if (employmentConflict.length <= 0) {
      return 'Please select your family details';
    };
  },
};
