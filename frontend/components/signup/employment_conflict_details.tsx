import React from "react";
import { FormFields, FormFieldsType } from "./util";
import { SignUpComponentProps } from "./signup.interfaces";

export const EmploymentConflictDetails: React.FC = (): React.JSX.Element => (
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

export const EmploymentConflictDetailsFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo,
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content">
    <div className="form-fields-section">
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FormFields.conflictFirmName] ? 'error-field' : ''}`}
          type="text"
          placeholder="Firm Name"
          value={userInfo[FormFields.conflictFirmName]}
          onChange={updateField(FormFields.conflictFirmName)}
        />
        {errors[FormFields.conflictFirmName] && <div className="signup-form-field-error">
          {errors[FormFields.conflictFirmName]}
        </div>}
      </div>
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FormFields.conflictEmployeeName] ? 'error-field' : ''}`}
          type="text"
          placeholder="Employee name"
          value={userInfo[FormFields.conflictEmployeeName]}
          onChange={updateField(FormFields.conflictEmployeeName)}
        />
        {errors[FormFields.conflictEmployeeName] && <div className="signup-form-field-error">
          {errors[FormFields.conflictEmployeeName]}
        </div>}
      </div>
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FormFields.conflictRelationship] ? 'error-field' : ''}`}
          type="text"
          placeholder="Your relationship to employee"
          value={userInfo[FormFields.conflictRelationship]}
          onChange={updateField(FormFields.conflictRelationship)}
        />
        {errors[FormFields.conflictRelationship] && <div className="signup-form-field-error">
          {errors[FormFields.conflictRelationship]}
        </div>}
      </div>
    </div>
  </div>
);

export type ConflictDetailsValidation = {
  [key in keyof Pick<FormFieldsType, 'conflictFirmName' | 'conflictEmployeeName' | 'conflictRelationship'>]: (value: string) => string | undefined;
};

export const conflictDetailsValidations: ConflictDetailsValidation = {
  conflictFirmName: (conflictFirmName: string): string | undefined => {
    if (conflictFirmName.length <= 0) {
      return 'Please enter the firm name';
    };
  },
  conflictEmployeeName: (conflictEmployeeName: string): string | undefined => {
    if (conflictEmployeeName.length <= 0) {
      return 'Please enter the employee name';
    };
  },
  conflictRelationship: (conflictRelationship: string): string | undefined => {
    if (conflictRelationship.length <= 0) {
      return 'Please enter your relationship to the employee';
    };
  },
};
