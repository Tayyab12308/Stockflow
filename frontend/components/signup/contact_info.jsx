import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FORM_FIELDS, countryPhoneData } from "./util";
import PhoneInput from 'react-phone-number-input';
import ItemDropdown from "../item_dropdown";

const CustomPhoneInput = React.forwardRef(
  ({ value, onChange, prefix, errors, ...rest }, ref) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      {...rest}
      className={`signup-form-input ${errors[FORM_FIELDS.PHONE_NUMBER] ? 'error-field' : ''}`}
    />
  )
);

const CountryDropdown = ({ selected, onSelect }) => {
  const items = Object.keys(countryPhoneData).map((code) => ({
    value: code,
    label: `${countryPhoneData[code].name} (${countryPhoneData[code].areaCode})`
  }));

  return (
    <ItemDropdown
      selected={selected}
      items={items}
      onSelect={onSelect}
    />
  );
};

export const ContactInfo = () => (
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

export const ContactInfoFormSection = ({ updateField, errors, userInfo }) => {
  const [selectedCountry, setSelectedCountry] = useState("US");

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
                value={`${countryPhoneData[selectedCountry].areaCode} ${userInfo[FORM_FIELDS.PHONE_NUMBER]}`}
                onChange={(value) => {
                  // value is expected to be in E.164 format or null.
                  // We remove the area code from the incoming value to update the local part.
                  if (value) {
                    // Remove the area code from the value.
                    const prefix = countryPhoneData[selectedCountry].areaCode;
                    const localPart = value.startsWith(prefix)
                      ? value.slice(prefix.length)
                      : value;
                    updateField(FORM_FIELDS.PHONE_NUMBER)({ target: { value: localPart } });
                  } else {
                    updateField(FORM_FIELDS.PHONE_NUMBER)({ target: { value: "" } });
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
            {errors[FORM_FIELDS.PHONE_NUMBER] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.PHONE_NUMBER]}
            </div>}
          </div>
          <div className="input-container">
            <input
              className={`signup-form-input ${errors[FORM_FIELDS.ADDRESS] ? 'error-field' : ''}`}
              type="text"
              placeholder="Address"
              value={userInfo[FORM_FIELDS.ADDRESS]}
              onChange={updateField(FORM_FIELDS.ADDRESS)}
            />
            {errors[FORM_FIELDS.ADDRESS] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.ADDRESS]}
            </div>}
          </div>

          <div className="input-container">
            <input
              className={`signup-form-input ${errors[FORM_FIELDS.ADDITIONAL_ADDRESS] ? 'error-field' : ''}`}
              type="text"
              placeholder="Apartment #, Building #, etc"
              value={userInfo[FORM_FIELDS.ADDITIONAL_ADDRESS]}
              onChange={updateField(FORM_FIELDS.ADDITIONAL_ADDRESS)}
            />
            {errors[FORM_FIELDS.ADDITIONAL_ADDRESS] && <div className="signup-form-field-error">
              {errors[FORM_FIELDS.ADDITIONAL_ADDRESS]}
            </div>}
          </div>
          <div className="address-locale-info-container">
            <div className="input-container locale-container">
              <input
                className={`signup-form-input address-locale-input ${errors[FORM_FIELDS.CITY] ? 'error-field' : ''}`}
                type="text"
                placeholder="City"
                value={userInfo[FORM_FIELDS.CITY]}
                onChange={updateField(FORM_FIELDS.CITY)}
              />
              {errors[FORM_FIELDS.CITY] && <div className="signup-form-field-error">
                {errors[FORM_FIELDS.CITY]}
              </div>}
            </div>
            <div className="regional-info-container">
              <div className="input-container locale-container">
                <input
                  className={`signup-form-input regional-input ${errors[FORM_FIELDS.STATE] ? 'error-field' : ''}`}
                  type="text"
                  placeholder="State"
                  value={userInfo[FORM_FIELDS.STATE]}
                  onChange={updateField(FORM_FIELDS.STATE)}
                />
                {errors[FORM_FIELDS.STATE] && <div className="signup-form-field-error">
                  {errors[FORM_FIELDS.STATE]}
                </div>}
              </div>

              <div className="input-container locale-container">
                <input
                  className={`signup-form-input regional-input ${errors[FORM_FIELDS.ZIP_CODE] ? 'error-field' : ''}`}
                  type="text"
                  placeholder="Zip Code"
                  value={userInfo[FORM_FIELDS.ZIP_CODE]}
                  onChange={updateField(FORM_FIELDS.ZIP_CODE)}
                />
                {errors[FORM_FIELDS.ZIP_CODE] && <div className="signup-form-field-error">
                  {errors[FORM_FIELDS.ZIP_CODE]}
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

export const contactInfoValidations = {
  [FORM_FIELDS.PHONE_NUMBER]: (phoneNumber) => {
    if (phoneNumber.length <= 0) {
      return 'Please enter your phone number';
    };
  },
  [FORM_FIELDS.ADDRESS]: (address) => {
    if (address.length <= 0) {
      return 'Please enter your address';
    };
  },
  [FORM_FIELDS.ADDITIONAL_ADDRESS]: () => { },
  [FORM_FIELDS.CITY]: (city) => {
    if (city.length <= 0) {
      return 'Please enter your city';
    };
  },
  [FORM_FIELDS.STATE]: (state) => {
    if (state.length <= 0) {
      return 'Please enter your state';
    };
  },
  [FORM_FIELDS.ZIP_CODE]: (zipCode) => {
    if (zipCode.length <= 0) {
      return 'Please enter your zip code';
    };
  },
}