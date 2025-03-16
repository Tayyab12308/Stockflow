import React from "react";
import { FORM_FIELDS } from "./util";

export const EmploymentConflictDetails = () => (
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
      <img className="signup-image" src={window.signupInvestingExperienceImage} />
    </div>
  </>
);

export const EmploymentConflictDetailsFormSection = ({ updateField, errors, userInfo }) => (
  <div className="form-section-content">
    <div className="form-fields-section">
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FORM_FIELDS.CONFLICT_FIRM_NAME] ? 'error-field' : ''}`}
          type="text"
          placeholder="Firm Name"
          value={userInfo[FORM_FIELDS.CONFLICT_FIRM_NAME]}
          onChange={updateField(FORM_FIELDS.CONFLICT_FIRM_NAME)}
        />
        {errors[FORM_FIELDS.CONFLICT_FIRM_NAME] && <div className="signup-form-field-error">
          {errors[FORM_FIELDS.CONFLICT_FIRM_NAME]}
        </div>}
      </div>
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FORM_FIELDS.CONFLICT_EMPLOYEE_NAME] ? 'error-field' : ''}`}
          type="text"
          placeholder="Employee name"
          value={userInfo[FORM_FIELDS.CONFLICT_EMPLOYEE_NAME]}
          onChange={updateField(FORM_FIELDS.CONFLICT_EMPLOYEE_NAME)}
        />
        {errors[FORM_FIELDS.CONFLICT_EMPLOYEE_NAME] && <div className="signup-form-field-error">
          {errors[FORM_FIELDS.CONFLICT_EMPLOYEE_NAME]}
        </div>}
      </div>
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FORM_FIELDS.CONFLICT_RELATIONSHIP] ? 'error-field' : ''}`}
          type="text"
          placeholder="Your relationship to employee"
          value={userInfo[FORM_FIELDS.CONFLICT_RELATIONSHIP]}
          onChange={updateField(FORM_FIELDS.CONFLICT_RELATIONSHIP)}
        />
        {errors[FORM_FIELDS.CONFLICT_RELATIONSHIP] && <div className="signup-form-field-error">
          {errors[FORM_FIELDS.CONFLICT_RELATIONSHIP]}
        </div>}
      </div>
    </div>
  </div>
);

export const conflictDetailsValidations = {
  [FORM_FIELDS.CONFLICT_FIRM_NAME]: (conflictFirmName) => {
    if (conflictFirmName.length <= 0) {
      return 'Please enter the firm name';
    };
  },
  [FORM_FIELDS.CONFLICT_EMPLOYEE_NAME]: (conflictEmployeeName) => {
    if (conflictEmployeeName.length <= 0) {
      return 'Please enter the employee name';
    };
  },
  [FORM_FIELDS.CONFLICT_RELATIONSHIP]: (conflictRelationship) => {
    if (conflictRelationship.length <= 0) {
      return 'Please enter your relationship to the employee';
    };
  },
}