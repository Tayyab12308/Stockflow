import React from "react";
import { FormFields, FormFieldsType, OCCUPATION_DESCRIPTION, OCCUPATION_INDUSTRY } from "./util";
import ItemDropdown from "../itemDropdown";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

interface DropdownProps<T> {
  selected: T;
  onSelect: (value: T) => void;
  errors: Record<string, string | undefined>;
}

const OccupationDescriptionDropdown: React.FC<DropdownProps<string>> = ({
  selected,
  onSelect,
  errors
}: DropdownProps<string>): React.JSX.Element => {
  const items = OCCUPATION_DESCRIPTION.map((description: string) => ({
    value: description,
    label: description,
  }));

  // Determine the label for the currently selected country.
  const selectedLabel: string = selected || "Occupation/Job description";

  return (
    <ItemDropdown
      selected={selectedLabel}
      items={items}
      onSelect={onSelect}
      buttonClassName={`signup-form-input ${errors[FormFields.jobDescription] ? 'error-field' : ''}`}
      itemClassName="identity-citizenship-dropdown"
    />
  );
};

const OccupationIndustryDropdown: React.FC<DropdownProps<string>> = ({
  selected,
  onSelect,
  errors,
}: DropdownProps<string>): React.JSX.Element => {
  const items = OCCUPATION_INDUSTRY.map(description => ({
    value: description,
    label: description,
  }));

  // Determine the label for the currently selected country.
  const selectedLabel = selected || "Occupation/Job Industry";

  return (
    <ItemDropdown
      selected={selectedLabel}
      items={items}
      onSelect={onSelect}
      buttonClassName={`signup-form-input ${errors[FormFields.jobIndustry] ? 'error-field' : ''}`}
      itemClassName="identity-citizenship-dropdown"
    />
  );
};

export const EmploymentDetails = (): React.JSX.Element => (
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

export const EmploymentDetailsFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo
}: SignUpComponentProps): React.JSX.Element => (
  <div className="form-section-content">
    <div className="form-fields-section">
      <div className="input-container">
        <input
          className={`signup-form-input ${errors[FormFields.employerName] ? 'error-field' : ''}`}
          type="text"
          placeholder="Employer name"
          value={userInfo[FormFields.employerName]}
          onChange={updateField(FormFields.employerName)}
        />
        {errors[FormFields.employerName] && <div className="signup-form-field-error">
          {errors[FormFields.employerName]}
        </div>}
      </div>
      <div className="input-container">
        <OccupationDescriptionDropdown
          selected={userInfo[FormFields.jobDescription]}
          onSelect={(name) => updateField(FormFields.jobDescription)({ target: { value: name } })}
          errors={errors}
        />
        {errors[FormFields.jobDescription] && <div className="signup-form-field-error">
          {errors[FormFields.jobDescription]}
        </div>}
      </div>
      <div className="input-container">
        <OccupationIndustryDropdown
          selected={userInfo[FormFields.jobIndustry]}
          onSelect={(name) => updateField(FormFields.jobIndustry)({ target: { value: name } })}
          errors={errors}
        />
        {errors[FormFields.jobIndustry] && <div className="signup-form-field-error">
          {errors[FormFields.jobIndustry]}
        </div>}
      </div>
    </div>
  </div>
);

export type EmploymentDetailsValidation = {
  [key in keyof Pick<FormFieldsType, 'employerName' | 'jobDescription' | 'jobIndustry'>]: (value: string) => string | undefined;
};

export const employmentDetailsValidations: EmploymentDetailsValidation = {
  employerName: (employerName: string): string | undefined => {
    if (employerName.length <= 0) {
      return 'Please enter your employer name';
    };
  },
  jobDescription: (jobDescription: string): string | undefined => {
    if (jobDescription.length <= 0) {
      return 'Please select your job description';
    };
  },
  jobIndustry: (jobIndustry: string): string | undefined => {
    if (jobIndustry.length <= 0) {
      return 'Please select your job industry';
    };
  },
}