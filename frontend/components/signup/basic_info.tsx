import React from "react";
import { Link } from "react-router-dom";
import { FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const BasicInfo: React.FC = (): React.JSX.Element => (
  <>
    <img className="signup-stockflow-logo" src={assetService.getImage('stockflowLogo')} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Create your login
      </div>
      <div className="information-section-details">
        We'll need your name, email address, and a unique password. You'll use this login to access Stockflow next time.
      </div>
      <img className="signup-image" src={assetService.getImage('signupBasicInfoImage')} />
    </div>
  </>
);

export const BasicInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content">
    <div>
      <div className="form-section-info-text">
        Enter your first and last name as they appear on your government ID.
      </div>
      <div className="form-fields-section">
        <div className="form-section-basic-input">
          <div className="input-container shared-row-field">
            <input
              className={`signup-form-input ${errors[FormFields.firstName] ? 'error-field' : ''}`}
              type="text"
              placeholder="First name"
              value={userInfo[FormFields.firstName]}
              onChange={updateField(FormFields.firstName)}
            />
            {errors[FormFields.firstName] && <div className="signup-form-field-error">
              {errors[FormFields.firstName]}
            </div>}
          </div>
          <div className="input-container shared-row-field">
            <input
              className={`signup-form-input ${errors[FormFields.lastName] ? 'error-field' : ''}`}
              type="text"
              placeholder="Last name"
              value={userInfo[FormFields.lastName]}
              onChange={updateField(FormFields.lastName)}
            />
            {errors[FormFields.lastName] && <div className="signup-form-field-error">
              {errors[FormFields.lastName]}
            </div>}
          </div>
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FormFields.emailAddress] ? 'error-field' : ''}`}
            type="text"
            placeholder="Email address"
            value={userInfo[FormFields.emailAddress]}
            onChange={updateField(FormFields.emailAddress)}
          />
          {errors[FormFields.emailAddress] && <div className="signup-form-field-error">
            {errors[FormFields.emailAddress]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FormFields.password] ? 'error-field' : ''}`}
            type="password"
            placeholder="Password"
            value={userInfo[FormFields.password]}
            onChange={updateField(FormFields.password)}
          />
          {errors[FormFields.password] && <div className="signup-form-field-error">
            {errors[FormFields.password]}
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

export type BasicInfoValidation = {
  [key in keyof Pick<FormFieldsType, 'firstName' | 'lastName' | 'emailAddress' | 'password'>]: (value: string) => string | undefined;
};

export const basicInfoValidations: BasicInfoValidation = {
  firstName: (firstName: string): string | undefined => {
    if (firstName.length <= 0) {
      return 'Please enter your first name';
    };
  },
  lastName: (lastName: string): string | undefined => {
    if (lastName.length <= 0) {
      return 'Please enter your last name';
    };
  },
  emailAddress: (email: string): string | undefined => {
    if (email.length <= 0) {
      return 'Please enter your email';
    };
  },
  password: (password: string): string | undefined => {
    if (password.length <= 6) {
      return 'Your password must be at least 6 characters';
    };
  }
};
