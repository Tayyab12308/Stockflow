import React from "react";
import { Link } from "react-router-dom";
import { FORM_FIELDS } from "./util";

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

export const BasicInfoFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content">
    <div>
      <div className="form-section-info-text">
        Enter your first and last name as they appear on your government ID.
      </div>
      <div className="form-fields-section">
        <div className="form-section-basic-input">
          <div className="input-container shared-row-field">
            <input
              className={`signup-form-input ${errors[FORM_FIELDS.FIRST_NAME] ? 'error-field' : ''}`}
              type="text"
              placeholder="First name"
              value={userInfo[FORM_FIELDS.FIRST_NAME]}
              onChange={updateField(FORM_FIELDS.FIRST_NAME)}
            />
            {errors[FORM_FIELDS.FIRST_NAME] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.FIRST_NAME]}
            </div>}
          </div>
          <div className="input-container shared-row-field">
            <input
              className={`signup-form-input ${errors[FORM_FIELDS.LAST_NAME] ? 'error-field' : ''}`}
              type="text"
              placeholder="Last name"
              value={userInfo[FORM_FIELDS.LAST_NAME]}
              onChange={updateField(FORM_FIELDS.LAST_NAME)}
            />
            {errors[FORM_FIELDS.LAST_NAME] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.LAST_NAME]}
            </div>}
          </div>
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FORM_FIELDS.EMAIL_ADDRESS] ? 'error-field' : ''}`}
            type="text"
            placeholder="Email address"
            value={userInfo[FORM_FIELDS.EMAIL_ADDRESS]}
            onChange={updateField(FORM_FIELDS.EMAIL_ADDRESS)}
          />
          {errors[FORM_FIELDS.EMAIL_ADDRESS] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.EMAIL_ADDRESS]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FORM_FIELDS.PASSWORD] ? 'error-field' : ''}`}
            type="password"
            placeholder="Password"
            value={userInfo[FORM_FIELDS.PASSWORD]}
            onChange={updateField(FORM_FIELDS.PASSWORD)}
          />
          {errors[FORM_FIELDS.PASSWORD] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.PASSWORD]}
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
  </div>
);

export const basicInfoValidations = {
  [FORM_FIELDS.FIRST_NAME]: (firstName) => {
    if (firstName.length <= 0) {
      return 'Please enter your first name';
    };
  },
  [FORM_FIELDS.LAST_NAME]: (lastName) => {
    if (lastName.length <= 0) {
      return 'Please enter your last name';
    };
  },
  [FORM_FIELDS.EMAIL_ADDRESS]: (email) => {
    if (email.length <= 0) {
      return 'Please enter your email';
    };
  },
  [FORM_FIELDS.PASSWORD]: (password) => {
    if (password.length <= 6) {
      return 'Your password must be at least 6 characters';
    };
  },
};
