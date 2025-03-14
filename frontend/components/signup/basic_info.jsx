import React from "react";
import { Link } from "react-router-dom";

export const BasicInfo = () => (
  <>
    <img className="signup-stockflow-logo" src={window.stockflowLogo} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Create your login
      </div>
      <div className="information-section-details">
        We'll need your name, email address, and a unique password. You'll use this login to access Stockflow next time.
      </div>
      <img className="signup-image" src={window.signupBasicInfoImage} />
    </div>
  </>
);

export const BasicInfoFormSection = ({ updateField, errors, formFields, userInfo }) => (
  <>
    <div>
      <div className="form-section-info-text">
        Enter your first and last name as they appear on your government ID.
      </div>
      <div className="form-fields-section">
        <div className="form-section-basic-input">
          <div className="input-container shared-row-field">
            <input
              className={`signup-form-input ${errors[formFields.FIRST_NAME] ? 'error-field' : ''}`}
              type="text"
              placeholder="First name"
              value={userInfo[formFields.FIRST_NAME]}
              onChange={updateField(formFields.FIRST_NAME)}
            />
            {errors[formFields.FIRST_NAME] && <div className="signup-form-field-error">
              {errors[formFields.FIRST_NAME]}
            </div>}
          </div>
          <div className="input-container shared-row-field">
            <input
              className={`signup-form-input ${errors[formFields.LAST_NAME] ? 'error-field' : ''}`}
              type="text"
              placeholder="Last name"
              value={userInfo[formFields.LAST_NAME]}
              onChange={updateField(formFields.LAST_NAME)}
            />
            {errors[formFields.LAST_NAME] && <div className="signup-form-field-error">
              {errors[formFields.LAST_NAME]}
            </div>}
          </div>
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.EMAIL] ? 'error-field' : ''}`}
            type="text"
            placeholder="Email address"
            value={userInfo[formFields.EMAIL]}
            onChange={updateField(formFields.EMAIL)}
          />
          {errors[formFields.EMAIL] && <div className="signup-form-field-error">
            {errors[formFields.EMAIL]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[formFields.PASSWORD] ? 'error-field' : ''}`}
            type="password"
            placeholder="Password"
            value={userInfo[formFields.PASSWORD]}
            onChange={updateField(formFields.PASSWORD)}
          />
          {errors[formFields.PASSWORD] && <div className="signup-form-field-error">
            {errors[formFields.PASSWORD]}
          </div>}
        </div>
      </div>

      <div>
        <div className="login-redirect-text">
          Already Signed Up?
        </div>
        <Link className="login-redirect-link" to="/login">
          Log in to your account
        </Link>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer">
        By continuing, you agree to the Stockflow User Account Agreement and Privacy Policy.
      </div>
      <div>
        This site is protected by reCAPTCHA and the Google Privacy Policy. Terms of Service apply.
      </div>
    </div>
  </>
);
