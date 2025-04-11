import React from "react";
import { OPTIONS_TRADING_PREFERENCES, FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const OptionsTradingInfo: React.FC = (): React.JSX.Element => (
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

export const OptionsTradingInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-section-info-text">
        Would you like to enable commission-free options trading once your account is approved?
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="experience-radio-group">
            {Object.entries(OPTIONS_TRADING_PREFERENCES).map(([preference, label], idx) => {
              return (
                <label className={`experience-radio-label ${userInfo[FormFields.optionsTradingPreference] === preference ? 'selected-experience' : ''}`} key={idx}>
                  <input
                    type="radio"
                    name="option"
                    className="experience-radio-option"
                    value={preference}
                    checked={userInfo[FormFields.optionsTradingPreference] === preference}
                    onChange={updateField(FormFields.optionsTradingPreference)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
            {errors[FormFields.optionsTradingPreference] && <div className="signup-form-field-error">
              {errors[FormFields.optionsTradingPreference]}
            </div>}
          </div>
        </div>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer experience">
        Options are risky and aren't suitable for all investors. To learn about risks, read the options disclosure.
        Other fees may apply.
      </div>
    </div>
  </div>
);

export type EmploymentDetailsValidation = {
  [key in keyof Pick<FormFieldsType, 'optionsTradingPreference'>]: (value: string) => string | undefined;
};

export const optionsTradingValidations = {
  optionsTradingPreference: (optionsTradingPreference: string): string | undefined => {
    if (optionsTradingPreference === null) {
      return 'Please select your options trading preference';
    };
  },
};
