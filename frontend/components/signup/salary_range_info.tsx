import React from "react";
import { INCOME_RANGE_OPTIONS_LABELS, FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const SalaryRangeInfo: React.FC = (): React.JSX.Element => (
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

export const SalaryRangeInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo 
}: SignUpComponentProps): React.JSX.Element => (
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
            {Object.entries(INCOME_RANGE_OPTIONS_LABELS).map(([rangeOption, label], idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FormFields.salaryRange] === rangeOption ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={rangeOption}
                    checked={userInfo[FormFields.salaryRange] === rangeOption}
                    onChange={updateField(FormFields.salaryRange)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
            {errors[FormFields.salaryRange] && <div className="signup-form-field-error">
              {errors[FormFields.salaryRange]}
            </div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export type EmploymentDetailsValidation = {
  [key in keyof Pick<FormFieldsType, 'salaryRange'>]: (value: string) => string | undefined;
};

export const salaryRangeValidations = {
  salaryRange: (salaryRange: string): string | undefined => {
    if (salaryRange.length <= 0) {
      return 'Please select your salary range';
    };
  },
};
