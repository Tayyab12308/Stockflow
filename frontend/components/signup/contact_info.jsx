import React from "react";
import { Link } from "react-router-dom";

export const ContactInfo = () => (
  <>
    <img className="signup-stockflow-logo" src={window.stockflowLogo} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Help us verify your identity
      </div>
      <div className="information-section-details">
        We're required by law to collect certain information that helps us know it's you when you log in to Stockflow.
        It's all about keeping your account safe.
      </div>
      <img className="signup-image" src={window.signupContactInfoImage} />
    </div>
  </>
);

export const ContactInfoFormSection = ({ updateField, errors, formFields, userInfo }) => (
  <>
    <div>
      <div className="form-fields-section">
        <div className="input-container d">
          <input
            className={`signup-form-input ${errors[formFields.PHONE_NUMBER] ? 'error-field' : ''}`}
            type="text"
            placeholder="Phone Number"
            value={userInfo[formFields.PHONE_NUMBER]}
            onChange={updateField(formFields.PHONE_NUMBER)}
          />
          {errors[formFields.PHONE_NUMBER] && <div className="signup-form-field-error">
            {errors[formFields.PHONE_NUMBER]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.ADDRESS] ? 'error-field' : ''}`}
            type="text"
            placeholder="Address"
            value={userInfo[formFields.ADDRESS]}
            onChange={updateField(formFields.ADDRESS)}
          />
          {errors[formFields.ADDRESS] && <div className="signup-form-field-error">
            {errors[formFields.ADDRESS]}
          </div>}
        </div>

        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.ADDITIONAL_ADDRESS] ? 'error-field' : ''}`}
            type="text"
            placeholder="Apartment #, Building #, etc"
            value={userInfo[formFields.ADDITIONAL_ADDRESS]}
            onChange={updateField(formFields.ADDITIONAL_ADDRESS)}
          />
          {errors[formFields.ADDITIONAL_ADDRESS] && <div className="signup-form-field-error">
            {errors[formFields.ADDITIONAL_ADDRESS]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.CITY] ? 'error-field' : ''}`}
            type="text"
            placeholder="City"
            value={userInfo[formFields.CITY]}
            onChange={updateField(formFields.CITY)}
          />
          {errors[formFields.CITY] && <div className="signup-form-field-error">
            {errors[formFields.CITY]}
          </div>}
        </div>

        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.STATE] ? 'error-field' : ''}`}
            type="text"
            placeholder="State"
            value={userInfo[formFields.STATE]}
            onChange={updateField(formFields.STATE)}
          />
          {errors[formFields.STATE] && <div className="signup-form-field-error">
            {errors[formFields.STATE]}
          </div>}
        </div>

        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.ZIP_CODE] ? 'error-field' : ''}`}
            type="text"
            placeholder="Zip Code"
            value={userInfo[formFields.ZIP_CODE]}
            onChange={updateField(formFields.ZIP_CODE)}
          />
          {errors[formFields.ZIP_CODE] && <div className="signup-form-field-error">
            {errors[formFields.ZIP_CODE]}
          </div>}
        </div>
      </div>


    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer">
        We will never share this information with marketers and we will never send you spam.
      </div>
    </div>
  </>
);
