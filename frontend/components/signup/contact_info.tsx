import React, { ForwardedRef, useState } from "react";
import { CountryCode, CountryPhoneInfo, FormFields, FormFieldsType, countryPhoneData } from "./util";
import PhoneInput from 'react-phone-number-input';
import ItemDropdown from "../itemDropdown";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

interface CustomPhoneInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  prefix: string;
  errors: Record<string, string | undefined>;
}

const CustomPhoneInput: React.ForwardRefExoticComponent<CustomPhoneInputProps
  & React.RefAttributes<HTMLInputElement>> = React.forwardRef(
    ({
      value,
      onChange,
      prefix,
      errors,
      ...rest
    }: CustomPhoneInputProps,
      ref: ForwardedRef<HTMLInputElement>): React.JSX.Element => (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        {...rest}
        className={`signup-form-input ${errors[FormFields.phoneNumber] ? 'error-field' : ''}`}
      />
    )
  );

interface CountryDropdownProps {
  selected: CountryCode;
  onSelect: (code: CountryCode) => void;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selected,
  onSelect,
}: CountryDropdownProps): React.JSX.Element => {
  const items = Object.entries(countryPhoneData).map(([code, countryData]: [string, CountryPhoneInfo]) => ({
    value: code as CountryCode,
    label: `${countryData.name} (${countryData.areaCode})`
  }));

  return (
    <ItemDropdown
      selected={selected}
      items={items}
      onSelect={onSelect}
    />
  );
};

export const ContactInfo: React.FC = (): React.JSX.Element => (
  <>
    <img className="signup-stockflow-logo" src={assetService.getImage('stockflowLogo')} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Help us verify your identity
      </div>
      <div className="information-section-details">
        We're required by law to collect certain information that helps us know it's you when you log in to Stockflow.
        It's all about keeping your account safe.
      </div>
      <img className="signup-image" src={assetService.getImage('signupContactInfoImage')} />
    </div>
  </>
);

export const ContactInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo,
}: SignUpComponentProps): React.JSX.Element => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");

  return (
    <div className="form-section-content shrink-gap">
      <div>
        <div className="form-fields-section">
          <div className="input-container">
            <div className="phone-input-container">
              <CountryDropdown
                selected={selectedCountry}
                onSelect={(code) => setSelectedCountry(code)}
              />
              <PhoneInput
                placeholder="Phone number"
                value={`${countryPhoneData[selectedCountry].areaCode} ${userInfo[FormFields.phoneNumber]}`}
                onChange={(value) => {
                  // value is expected to be in E.164 format or null.
                  // We remove the area code from the incoming value to update the local part.
                  if (value) {
                    // Remove the area code from the value.
                    const prefix = countryPhoneData[selectedCountry].areaCode;
                    const localPart = value.startsWith(prefix)
                      ? value.slice(prefix.length)
                      : value;
                    updateField(FormFields.phoneNumber)({ target: { value: localPart } });
                  } else {
                    updateField(FormFields.phoneNumber)({ target: { value: "" } });
                  }
                }}
                defaultCountry={selectedCountry}
                // We disable the built-in country select by providing a dummy component.
                countrySelectComponent={() => null}
                // Pass our custom input component.
                inputComponent={CustomPhoneInput}
                // Pass our immutable prefix to the custom input.
                prefix={countryPhoneData[selectedCountry].areaCode}
                errors={errors}
              />
            </div>
            {errors[FormFields.phoneNumber] && <div className="signup-form-field-error">
              {errors[FormFields.phoneNumber]}
            </div>}
          </div>
          <div className="input-container">
            <input
              className={`signup-form-input ${errors[FormFields.address] ? 'error-field' : ''}`}
              type="text"
              placeholder="Address"
              value={userInfo[FormFields.address]}
              onChange={updateField(FormFields.address)}
            />
            {errors[FormFields.address] && <div className="signup-form-field-error">
              {errors[FormFields.address]}
            </div>}
          </div>

          <div className="input-container">
            <input
              className={`signup-form-input ${errors[FormFields.additionalAddress] ? 'error-field' : ''}`}
              type="text"
              placeholder="Apartment #, Building #, etc"
              value={userInfo[FormFields.additionalAddress]}
              onChange={updateField(FormFields.additionalAddress)}
            />
            {errors[FormFields.additionalAddress] && <div className="signup-form-field-error">
              {errors[FormFields.additionalAddress]}
            </div>}
          </div>
          <div className="address-locale-info-container">
            <div className="input-container locale-container">
              <input
                className={`signup-form-input address-locale-input ${errors[FormFields.city] ? 'error-field' : ''}`}
                type="text"
                placeholder="City"
                value={userInfo[FormFields.city]}
                onChange={updateField(FormFields.city)}
              />
              {errors[FormFields.city] && <div className="signup-form-field-error">
                {errors[FormFields.city]}
              </div>}
            </div>
            <div className="regional-info-container">
              <div className="input-container locale-container">
                <input
                  className={`signup-form-input regional-input ${errors[FormFields.state] ? 'error-field' : ''}`}
                  type="text"
                  placeholder="State"
                  value={userInfo[FormFields.state]}
                  onChange={updateField(FormFields.state)}
                />
                {errors[FormFields.state] && <div className="signup-form-field-error">
                  {errors[FormFields.state]}
                </div>}
              </div>

              <div className="input-container locale-container">
                <input
                  className={`signup-form-input regional-input ${errors[FormFields.zipCode] ? 'error-field' : ''}`}
                  type="text"
                  placeholder="Zip Code"
                  value={userInfo[FormFields.zipCode]}
                  onChange={updateField(FormFields.zipCode)}
                />
                {errors[FormFields.zipCode] && <div className="signup-form-field-error">
                  {errors[FormFields.zipCode]}
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="signup-form-footer">
        <div className="disclaimers-footer">
          We will never share this information with marketers and we will never send you spam.
        </div>
      </div>
    </div>
  )
};

export type ContactInfoValidation = {
  [key in keyof Pick<FormFieldsType, 'phoneNumber' | 'address' | 'additionalAddress' | 'city' | 'state' | 'zipCode'>]: (value: string) => string | undefined;
};

export const contactInfoValidations: ContactInfoValidation = {
  phoneNumber: (phoneNumber: string): string | undefined => {
    if (phoneNumber.length <= 0) {
      return 'Please enter your phone number';
    };
  },
  address: (address: string): string | undefined => {
    if (address.length <= 0) {
      return 'Please enter your address';
    };
  },
  additionalAddress: (additionalAddress: string) => undefined,
  city: (city: string): string | undefined => {
    if (city.length <= 0) {
      return 'Please enter your city';
    };
  },
  state: (state: string): string | undefined => {
    if (state.length <= 0) {
      return 'Please enter your state';
    };
  },
  zipCode: (zipCode: string): string | undefined => {
    if (zipCode.length <= 0) {
      return 'Please enter your zip code';
    };
  },
}