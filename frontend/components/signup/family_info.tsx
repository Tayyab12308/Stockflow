import React from "react";
import { FAMILY_OPTIONS, FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const FamilyInfo: React.FC = (): React.JSX.Element => (
  <>
    <img className="signup-stockflow-logo" src={assetService.getImage('stockflowLogo')} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Answer a few questions about investing
      </div>
      <div className="information-section-details">
        To help you open a Stockflow account, we need to ask a few questions about you and your experience with investing.
      </div>
      <img className="signup-image" src={assetService.getImage('signupInvestingExperienceImage')} />
    </div>
  </>
);

export const FamilyInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
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
            {Object.entries(FAMILY_OPTIONS).map(([familyStatusOption, label], idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FormFields.familyStatus] === familyStatusOption ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={familyStatusOption}
                    checked={userInfo[FormFields.familyStatus] === familyStatusOption}
                    onChange={updateField(FormFields.familyStatus)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
            {errors[FormFields.familyStatus] && <div className="signup-form-field-error">
              {errors[FormFields.familyStatus]}
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

export type FamilyValidation = {
  [key in keyof Pick<FormFieldsType, 'familyStatus'>]: (value: string) => string | undefined;
};

export const familyValidations: FamilyValidation = {
  familyStatus: (familyStatus: string): string | undefined => {
    if (familyStatus.length <= 0) {
      return 'Please select your family details';
    };
  },
};
