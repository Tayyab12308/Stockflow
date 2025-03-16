import React from "react";
import { FORM_FIELDS, OCCUPATION_DESCRIPTION, OCCUPATION_INDUSTRY } from "./util";
import ItemDropdown from "../item_dropdown";

const OccupationDescriptionDropdown = ({ selected, onSelect, errors }) => {
  const items = OCCUPATION_DESCRIPTION.map(description => ({
    value: description,
    label: description,
  }));

  // Determine the label for the currently selected country.
  const selectedLabel = selected || "Occupation/Job description";

  return (
    <ItemDropdown
      selected={selectedLabel}
      items={items}
      onSelect={onSelect}
      buttonClassName={`signup-form-input ${errors[FORM_FIELDS.PHONE_NUMBER] ? 'error-field' : ''}`}
      itemClassName="identity-citizenship-dropdown"
    />
  );
};

const OccupationIndustryDropdown = ({ selected, onSelect, errors }) => {
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
      buttonClassName={`signup-form-input ${errors[FORM_FIELDS.PHONE_NUMBER] ? 'error-field' : ''}`}
      itemClassName="identity-citizenship-dropdown"
    />
  );
};

export const EmploymentDetails = () => (
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

export const EmploymentDetailsFormSection = ({ updateField, errors, userInfo }) => {
  return (
    <div className="form-section-content">
      <div className="form-fields-section">
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FORM_FIELDS.EMPLOYER_NAME] ? 'error-field' : ''}`}
            type="text"
            placeholder="Employer name"
            value={userInfo[FORM_FIELDS.EMPLOYER_NAME]}
            onChange={updateField(FORM_FIELDS.EMPLOYER_NAME)}
          />
          {errors[FORM_FIELDS.EMPLOYER_NAME] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.EMPLOYER_NAME]}
          </div>}
        </div>
        <div className="input-container">
          <OccupationDescriptionDropdown
            selected={userInfo[FORM_FIELDS.JOB_DESCRIPTION]}
            onSelect={(name) => updateField(FORM_FIELDS.JOB_DESCRIPTION)({ target: { value: name } })}
            errors={errors}
          />
          {errors[FORM_FIELDS.JOB_DESCRIPTION] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.JOB_DESCRIPTION]}
          </div>}
        </div>
        <div className="input-container">
          <OccupationIndustryDropdown
            selected={userInfo[FORM_FIELDS.JOB_INDUSTRY]}
            onSelect={(name) => updateField(FORM_FIELDS.JOB_INDUSTRY)({ target: { value: name } })}
            errors={errors}
          />
          {errors[FORM_FIELDS.JOB_INDUSTRY] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.JOB_INDUSTRY]}
          </div>}
        </div>
      </div>
    </div>
  )
};

export const employmentDetailsValidations = {
  [FORM_FIELDS.EMPLOYER_NAME]: (employerName) => {
    if (employerName.length <= 0) {
      return 'Please enter your employer name';
    };
  },
  [FORM_FIELDS.JOB_DESCRIPTION]: (jobDescription) => {
    if (jobDescription.length <= 0) {
      return 'Please select your job description';
    };
  },
  [FORM_FIELDS.JOB_INDUSTRY]: (jobIndustry) => {
    if (jobIndustry.length <= 0) {
      return 'Please select your job industry';
    };
  },
}