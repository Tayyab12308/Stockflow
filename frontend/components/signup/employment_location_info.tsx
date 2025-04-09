import React from "react";
import { FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const EmploymentLocationInfo = (): React.JSX.Element => (
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

export const EmploymentLocationInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo,
  skipPage
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content shrink-gap">
    <div>
      <div className="form-section-info-text">
        What's your employer's address?
      </div>
      <div className="form-section-info-sub-text">
        You can find this on your tax documents. We'll never share this information with marketers or send you spam.
      </div>
      <div className="form-fields-section">
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FormFields.jobAddress] ? 'error-field' : ''}`}
            type="text"
            placeholder="Employer's Address"
            value={userInfo[FormFields.jobAddress]}
            onChange={updateField(FormFields.jobAddress)}
          />
          {errors[FormFields.jobAddress] && <div className="signup-form-field-error">
            {errors[FormFields.jobAddress]}
          </div>}
        </div>

        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FormFields.jobAdditionalAddress] ? 'error-field' : ''}`}
            type="text"
            placeholder="Apartment #, Building #, etc"
            value={userInfo[FormFields.jobAdditionalAddress]}
            onChange={updateField(FormFields.jobAdditionalAddress)}
          />
          {errors[FormFields.jobAdditionalAddress] && <div className="signup-form-field-error">
            {errors[FormFields.jobAdditionalAddress]}
          </div>}
        </div>
        <div className="address-locale-info-container">
          <div className="input-container locale-container">
            <input
              className={`signup-form-input address-locale-input ${errors[FormFields.jobCity] ? 'error-field' : ''}`}
              type="text"
              placeholder="City"
              value={userInfo[FormFields.jobCity]}
              onChange={updateField(FormFields.jobCity)}
            />
            {errors[FormFields.jobCity] && <div className="signup-form-field-error">
              {errors[FormFields.jobCity]}
            </div>}
          </div>
          <div className="regional-info-container">
            <div className="input-container locale-container">
              <input
                className={`signup-form-input regional-input ${errors[FormFields.jobState] ? 'error-field' : ''}`}
                type="text"
                placeholder="State"
                value={userInfo[FormFields.jobState]}
                onChange={updateField(FormFields.jobState)}
              />
              {errors[FormFields.jobState] && <div className="signup-form-field-error">
                {errors[FormFields.jobState]}
              </div>}
            </div>

            <div className="input-container locale-container">
              <input
                className={`signup-form-input regional-input ${errors[FormFields.jobZipCode] ? 'error-field' : ''}`}
                type="text"
                placeholder="Zip Code"
                value={userInfo[FormFields.jobZipCode]}
                onChange={updateField(FormFields.jobZipCode)}
              />
              {errors[FormFields.jobZipCode] && <div className="signup-form-field-error">
                {errors[FormFields.jobZipCode]}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer">
        If your employer is not located in the US, you can
        <button className="skip-step-text-button" onClick={skipPage}>skip this step</button>.
      </div>
    </div>
  </div>
);

export type EmploymentLocationValidation = {
  [key in keyof Pick<FormFieldsType, 'jobAddress' | 'jobAdditionalAddress' | 'jobCity' | 'jobState' | 'jobZipCode'>]: (value: string) => string | undefined;
};

export const employmentLocationValidations: EmploymentLocationValidation = {
  jobAddress: (jobAddress: string): string | undefined => {
    if (jobAddress.length <= 0) {
      return 'Please enter your employer\'s address';
    };
  },
  jobAdditionalAddress: (jobAdditionalAddress: string): string | undefined => {
    return undefined
  },
  jobCity: (jobCity: string): string | undefined => {
    if (jobCity.length <= 0) {
      return 'Please enter your employer\'s city';
    };
  },
  jobState: (jobState: string): string | undefined => {
    if (jobState.length <= 0) {
      return 'Please enter your employer\'s state';
    };
  },
  jobZipCode: (jobZipCode: string): string | undefined => {
    if (jobZipCode.length <= 0) {
      return 'Please enter your employer\'s zip code';
    };
  },
};
