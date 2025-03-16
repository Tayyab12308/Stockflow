import React, { useState } from "react";
import { FORM_FIELDS, countryPhoneData } from "./util";
import ItemDropdown from "../item_dropdown";

const CitizenshipDropdown = ({ selected, onSelect, errors }) => {
  const items = Object.keys(countryPhoneData).map(code => ({
    value: countryPhoneData[code].name,
    label: countryPhoneData[code].name
  }));

  // Determine the label for the currently selected country.
  const selectedLabel = selected || "Citizenship";

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

export const IdentityInfo = () => (
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

export const IdentityInfoFormSection = ({ updateField, errors, userInfo }) => {
  const [ssnPlaceholder, setSSNPlaceholder] = useState('Social Security Number');
  const [dobPlaceholder, setDOBPlaceholder] = useState('Date of Birth');

  const handleSSNFocus = () => setSSNPlaceholder('XXX-XX-XXXX');
  const handleSSNBlur = () => setSSNPlaceholder('Social Security Number');

  const handleDOBFocus = () => setDOBPlaceholder('MM/DD/YYYY');
  const handleDOBBlur = () => setDOBPlaceholder('Date of Birth');

  const handleSSNChange = (e) => {
    // Remove all non-digit characters.
    let input = e.target.value.replace(/\D/g, '');
    // Limit to 9 digits.
    if (input.length > 9) {
      input = input.slice(0, 9);
    }
    // Format into XXX-XX-XXXX
    const formatted = input.replace(/(\d{3})(\d{2})(\d{0,4})/, (match, p1, p2, p3) => {
      let result = p1;
      if (p2) result += '-' + p2;
      if (p3) result += '-' + p3;
      return result;
    });
    updateField(FORM_FIELDS.SOCIAL_SECURITY_NUMBER)({ target: { value: formatted } });
  };

  const handleDOBChange = (e) => {
    // Remove all non-digit characters.
    let input = e.target.value.replace(/\D/g, '');
    // Limit to 8 digits.
    if (input.length > 8) {
      input = input.slice(0, 8);
    }
    // Format into MM/DD/YYYY
    const formatted = input.replace(/(\d{2})(\d{2})(\d{0,4})/, (match, p1, p2, p3) => {
      let result = p1;
      if (p2) result += '/' + p2;
      if (p3) result += '/' + p3;
      return result;
    });
    updateField(FORM_FIELDS.DATE_OF_BIRTH)({ target: { value: formatted } });
  };

  return (
    <div className="form-section-content">
      <div className="form-fields-section">
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FORM_FIELDS.SOCIAL_SECURITY_NUMBER] ? 'error-field' : ''}`}
            type="text"
            placeholder={ssnPlaceholder}
            value={userInfo[FORM_FIELDS.SOCIAL_SECURITY_NUMBER]}
            onChange={handleSSNChange}
            onFocus={handleSSNFocus}
            onBlur={handleSSNBlur}
          />
          {errors[FORM_FIELDS.SOCIAL_SECURITY_NUMBER] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.SOCIAL_SECURITY_NUMBER]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FORM_FIELDS.DATE_OF_BIRTH] ? 'error-field' : ''}`}
            type="text"
            placeholder={dobPlaceholder}
            value={userInfo[FORM_FIELDS.DATE_OF_BIRTH]}
            onChange={handleDOBChange}
            onFocus={handleDOBFocus}
            onBlur={handleDOBBlur}
          />
          {errors[FORM_FIELDS.DATE_OF_BIRTH] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.DATE_OF_BIRTH]}
          </div>}
        </div>
        <div className="input-container">
          <CitizenshipDropdown
            selected={userInfo[FORM_FIELDS.CITIZENSHIP]}
            onSelect={(name) => updateField(FORM_FIELDS.CITIZENSHIP)({ target: { value: name } })}
            errors={errors}
          />
          {errors[FORM_FIELDS.CITIZENSHIP] && <div className="signup-form-field-error">
            {errors[FORM_FIELDS.CITIZENSHIP]}
          </div>}
        </div>
      </div>
    </div>
  )
};

export const identityInfoValidations = {
  [FORM_FIELDS.SOCIAL_SECURITY_NUMBER]: (socialSecurityNumber) => {
    if (socialSecurityNumber.length <= 0) {
      return 'Please enter your social security number';
    };
  },
  [FORM_FIELDS.DATE_OF_BIRTH]: (dateOfBirth) => {
    if (dateOfBirth.length <= 0) {
      return 'Please enter your date of birth';
    };
  },
  [FORM_FIELDS.CITIZENSHIP]: (citizenship) => {
    if (citizenship.length <= 0) {
      return 'Please enter your citizenship country';
    };
  },
}