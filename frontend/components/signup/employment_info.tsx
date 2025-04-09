import React from "react";
import { EMPLOYMENT_OPTIONS_LABELS, FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const EmploymentInfo = (): React.JSX.Element => (
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

export const EmploymentInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        Are you employed?
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.entries(EMPLOYMENT_OPTIONS_LABELS).map(([employmentOption, label], idx): React.JSX.Element => {
              return (
                <label className={`experience-radio-label ${userInfo[FormFields.employmentStatus] === employmentOption ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={employmentOption}
                    checked={userInfo[FormFields.employmentStatus] === employmentOption}
                    onChange={updateField(FormFields.employmentStatus)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
            {errors[FormFields.employmentStatus] && <div className="signup-form-field-error">
              {errors[FormFields.employmentStatus]}
            </div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export type EmploymentDetailsValidation = {
  [key in keyof Pick<FormFieldsType, 'employmentStatus'>]: (value: string) => string | undefined;
};

export const employmentValidations = {
  employmentStatus: (employmentStatus: string): string | undefined => {
    if (employmentStatus.length <= 0) {
      return 'Please select your employment status';
    };
  },
};
