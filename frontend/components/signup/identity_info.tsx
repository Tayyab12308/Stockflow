import React, { useState } from "react";
import { CountryPhoneInfo, FormFields, FormFieldsType, countryPhoneData } from "./util";
import ItemDropdown from "../itemDropdown";
import { SignUpComponentProps } from "./signup.interfaces";

interface CitizenshipDropdownProps {
  selected: string;
  onSelect: (value: string) => void;
  errors: Record<string, string | undefined>;
}

const CitizenshipDropdown: React.FC<CitizenshipDropdownProps> = ({
  selected,
  onSelect,
  errors,
}: CitizenshipDropdownProps): React.JSX.Element => {
  const items = Object.values(countryPhoneData).map((countryData: CountryPhoneInfo) => ({
    value: countryData.name,
    label: countryData.name
  }));

  // Determine the label for the currently selected country.
  const selectedLabel: string = selected || "Citizenship";

  return (
    <ItemDropdown
      selected={selectedLabel}
      items={items}
      onSelect={onSelect}
      buttonClassName={`signup-form-input ${errors[FormFields.citizenship] ? 'error-field' : ''}`}
      itemClassName="identity-citizenship-dropdown"
    />
  );
};

export const IdentityInfo: React.FC = (): React.JSX.Element => (
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

export const IdentityInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo,
}: SignUpComponentProps): React.JSX.Element => {
  const [ssnPlaceholder, setSSNPlaceholder] = useState<string>('Social Security Number');
  const [dobPlaceholder, setDOBPlaceholder] = useState<string>('Date of Birth');

  const handleSSNFocus = (): void => setSSNPlaceholder('XXX-XX-XXXX');
  const handleSSNBlur = (): void => setSSNPlaceholder('Social Security Number');

  const handleDOBFocus = (): void => setDOBPlaceholder('MM/DD/YYYY');
  const handleDOBBlur = (): void => setDOBPlaceholder('Date of Birth');

  const formatInput = (
    input: string,
    maxLength: number,
    pattern: RegExp,
    format: (matches: string[]) => string
  ): string => {
    // Remove all non-digit characters
    let numericInput = input.replace(/\D/g, "");

    if (numericInput.length > maxLength) {
      numericInput = numericInput.slice(0, maxLength);
    }

    return numericInput.replace(pattern, (...matches) => format(matches));
  };

  const handleInputChange = (field: string, maxLength: number, pattern: RegExp, format: (matches: string[]) => string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted: string = formatInput(e.target.value, maxLength, pattern, format);
      updateField(field)({ target: { value: formatted } });
    };

  // Social Security Number (XXX-XX-XXXX)
  const handleSSNChange = handleInputChange(
    FormFields.socialSecurityNumber,
    9,
    /(\d{3})(\d{2})(\d{0,4})/,
    ([_, p1, p2, p3]) => [p1, p2, p3].filter(Boolean).join("-")
  );

  // Date of Birth (MM/DD/YYYY)
  const handleDOBChange = handleInputChange(
    FormFields.dateOfBirth,
    8,
    /(\d{2})(\d{2})(\d{0,4})/,
    ([_, p1, p2, p3]) => [p1, p2, p3].filter(Boolean).join("/")
  );

  return (
    <div className="form-section-content">
      <div className="form-fields-section">
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FormFields.socialSecurityNumber] ? 'error-field' : ''}`}
            type="text"
            placeholder={ssnPlaceholder}
            value={userInfo[FormFields.socialSecurityNumber]}
            onChange={handleSSNChange}
            onFocus={handleSSNFocus}
            onBlur={handleSSNBlur}
          />
          {errors[FormFields.socialSecurityNumber] && <div className="signup-form-field-error">
            {errors[FormFields.socialSecurityNumber]}
          </div>}
        </div>
        <div className="input-container">
          <input
            className={`signup-form-input ${errors[FormFields.dateOfBirth] ? 'error-field' : ''}`}
            type="text"
            placeholder={dobPlaceholder}
            value={userInfo[FormFields.dateOfBirth]}
            onChange={handleDOBChange}
            onFocus={handleDOBFocus}
            onBlur={handleDOBBlur}
          />
          {errors[FormFields.dateOfBirth] && <div className="signup-form-field-error">
            {errors[FormFields.dateOfBirth]}
          </div>}
        </div>
        <div className="input-container">
          <CitizenshipDropdown
            selected={userInfo[FormFields.citizenship]}
            onSelect={(name: string) => updateField(FormFields.citizenship)({ target: { value: name } })}
            errors={errors}
          />
          {errors[FormFields.citizenship] && <div className="signup-form-field-error">
            {errors[FormFields.citizenship]}
          </div>}
        </div>
      </div>
    </div>
  )
};

export type IdentityInfoValidation = {
  [key in keyof Pick<FormFieldsType, 'socialSecurityNumber' | 'dateOfBirth' | 'citizenship'>]: (value: string) => string | undefined;
};

export const identityInfoValidations: IdentityInfoValidation = {
  socialSecurityNumber: (socialSecurityNumber: string): string | undefined => {
    if (socialSecurityNumber.length <= 0) {
      return 'Please enter your social security number';
    };
  },
  dateOfBirth: (dateOfBirth: string): string | undefined => {
    if (dateOfBirth.length <= 0) {
      return 'Please enter your date of birth';
    };
  },
  citizenship: (citizenship: string): string | undefined => {
    if (citizenship.length <= 0) {
      return 'Please enter your citizenship country';
    };
  },
}