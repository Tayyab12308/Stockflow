import React from "react";
import { EXPERIENCE_OPTIONS_LABELS, FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const ExperienceInfo: React.FC = (): React.JSX.Element => (
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

export const ExperienceInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo,
}: SignUpComponentProps): React.JSX.Element => (
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
            {Object.entries(EXPERIENCE_OPTIONS_LABELS).map(([expLevel, label], idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FormFields.investingExperience] === expLevel ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={expLevel}
                    checked={userInfo[FormFields.investingExperience] === expLevel}
                    onChange={updateField(FormFields.investingExperience)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
            {errors[FormFields.investingExperience] && <div className="signup-form-field-error">
              {errors[FormFields.investingExperience]}
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

export type EmploymentDetailsValidation = {
  [key in keyof Pick<FormFieldsType, 'investingExperience'>]: (value: string) => string | undefined;
};

export const experienceValidations = {
  investingExperience: (investingExperience: string): string | undefined => {
    if (investingExperience.length <= 0) {
      return 'Please select your experience level';
    };
  },
};
