import React, { useState } from "react";
import { FORM_FIELDS, countryPhoneData } from "./util";
import PhoneInput from 'react-phone-number-input';

export const EmploymentLocationInfo = () => (
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

export const EmploymentLocationInfoFormSection = ({ updateField, errors, userInfo, skipPage }) => {

  return (
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
              className={`signup-form-input ${errors[FORM_FIELDS.JOB_ADDRESS] ? 'error-field' : ''}`}
              type="text"
              placeholder="Employer's Address"
              value={userInfo[FORM_FIELDS.JOB_ADDRESS]}
              onChange={updateField(FORM_FIELDS.JOB_ADDRESS)}
            />
            {errors[FORM_FIELDS.JOB_ADDRESS] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.JOB_ADDRESS]}
            </div>}
          </div>

          <div className="input-container">
            <input
              className={`signup-form-input ${errors[FORM_FIELDS.JOB_ADDITIONAL_ADDRESS] ? 'error-field' : ''}`}
              type="text"
              placeholder="Apartment #, Building #, etc"
              value={userInfo[FORM_FIELDS.JOB_ADDITIONAL_ADDRESS]}
              onChange={updateField(FORM_FIELDS.JOB_ADDITIONAL_ADDRESS)}
            />
            {errors[FORM_FIELDS.JOB_ADDITIONAL_ADDRESS] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.JOB_ADDITIONAL_ADDRESS]}
            </div>}
          </div>
          <div className="address-locale-info-container">
            <div className="input-container locale-container">
              <input
                className={`signup-form-input address-locale-input ${errors[FORM_FIELDS.JOB_CITY] ? 'error-field' : ''}`}
                type="text"
                placeholder="City"
                value={userInfo[FORM_FIELDS.JOB_CITY]}
                onChange={updateField(FORM_FIELDS.JOB_CITY)}
              />
              {errors[FORM_FIELDS.JOB_CITY] && <div className="signup-form-field-error">
                {errors[FORM_FIELDS.JOB_CITY]}
              </div>}
            </div>
            <div className="regional-info-container">
              <div className="input-container locale-container">
                <input
                  className={`signup-form-input regional-input ${errors[FORM_FIELDS.JOB_STATE] ? 'error-field' : ''}`}
                  type="text"
                  placeholder="State"
                  value={userInfo[FORM_FIELDS.JOB_STATE]}
                  onChange={updateField(FORM_FIELDS.JOB_STATE)}
                />
                {errors[FORM_FIELDS.JOB_STATE] && <div className="signup-form-field-error">
                  {errors[FORM_FIELDS.JOB_STATE]}
                </div>}
              </div>

              <div className="input-container locale-container">
                <input
                  className={`signup-form-input regional-input ${errors[FORM_FIELDS.JOB_ZIP_CODE] ? 'error-field' : ''}`}
                  type="text"
                  placeholder="Zip Code"
                  value={userInfo[FORM_FIELDS.JOB_ZIP_CODE]}
                  onChange={updateField(FORM_FIELDS.JOB_ZIP_CODE)}
                />
                {errors[FORM_FIELDS.JOB_ZIP_CODE] && <div className="signup-form-field-error">
                  {errors[FORM_FIELDS.JOB_ZIP_CODE]}
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
  )
};

export const employmentLocationValidations = {
  [FORM_FIELDS.JOB_ADDRESS]: (address) => {
    if (address.length <= 0) {
      return 'Please enter your employer\'s address';
    };
  },
  [FORM_FIELDS.JOB_ADDITIONAL_ADDRESS]: () => { },
  [FORM_FIELDS.JOB_CITY]: (city) => {
    if (city.length <= 0) {
      return 'Please enter your employer\'s city';
    };
  },
  [FORM_FIELDS.JOB_STATE]: (state) => {
    if (state.length <= 0) {
      return 'Please enter your employer\'s state';
    };
  },
  [FORM_FIELDS.JOB_ZIP_CODE]: (zipCode) => {
    if (zipCode.length <= 0) {
      return 'Please enter your employer\'s zip code';
    };
  },
}