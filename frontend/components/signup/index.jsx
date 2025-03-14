import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BasicInfo, BasicInfoFormSection } from "./basic_info";
import { ContactInfo, ContactInfoFormSection } from "./contact_info";

const FORM_FIELDS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PASSWORD: 'password',
  PHONE_NUMBER: 'phoneNumber',
  ADDRESS: 'address',
  ADDITIONAL_ADDRESS: 'additionalAddress',
  CITY: 'city',
  STATE: 'state',
  ZIP_CODE: 'zipCode',
}

const FORM_PAGES = {
  BASIC_INFO: 'basicInfo',
  CONTACT_INFO: 'contactInfo',
}

export default Signup = () => {
  const [currentFormPage, setCurrentFormPage] = useState(FORM_PAGES.BASIC_INFO)
  const [userInfo, setUserInfo] = useState({
    [FORM_FIELDS.FIRST_NAME]: '',
    [FORM_FIELDS.LAST_NAME]: '',
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: '',
    [FORM_FIELDS.PHONE_NUMBER]: '',
    [FORM_FIELDS.ADDRESS]: '',
    [FORM_FIELDS.ADDITIONAL_ADDRESS]: '',
    [FORM_FIELDS.CITY]: '',
    [FORM_FIELDS.STATE]: '',
    [FORM_FIELDS.ZIP_CODE]: '',
  })
  const [errors, setErrors] = useState({
    [FORM_FIELDS.FIRST_NAME]: '',
    [FORM_FIELDS.LAST_NAME]: '',
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: '',
    [FORM_FIELDS.PHONE_NUMBER]: '',
    [FORM_FIELDS.ADDRESS]: '',
    [FORM_FIELDS.ADDITIONAL_ADDRESS]: '',
    [FORM_FIELDS.CITY]: '',
    [FORM_FIELDS.STATE]: '',
    [FORM_FIELDS.ZIP_CODE]: '',
  })

  const updateField = (fieldName) => (e) => setUserInfo(prev => ({ ...prev, [fieldName]: e.target.value }));

  const clearErrors = () => setErrors(Object.values(FORM_FIELDS).reduce((acc, curr) => ({...acc, [curr]: '' }), {}))

  const validations = {
    [FORM_PAGES.BASIC_INFO]: {
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
      [FORM_FIELDS.EMAIL]: (email) => {
        if (email.length <= 0) {
          return 'Please enter your email';
        };
      },
      [FORM_FIELDS.PASSWORD]: (password) => {
        if (password.length <= 6) {
          return 'Your password must be at least 6 characters';
        };
      },
    },
    [FORM_PAGES.CONTACT_INFO]: {
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
      [FORM_FIELDS.ADDITIONAL_ADDRESS]: () => {},
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
    }, 
  };

  const checkValidations = () => {
    const newErrors = Object.keys(validations[currentFormPage]).reduce((acc, curr) => ({
      ...acc,
      [curr]: validations[currentFormPage][curr](userInfo[curr])
    }), {});
    setErrors(prev => ({ ...prev, ...newErrors }));
    return newErrors;
  };

  const anyErrors = (errorObject) => Object.values(errorObject).some(e => e);

  const handleContinue = () => {
    clearErrors()
    const newErrors = checkValidations()

    console.log({newErrors});

    if (anyErrors(newErrors)) { return; }

    if (currentFormPage === FORM_PAGES.BASIC_INFO) {
      setCurrentFormPage(FORM_PAGES.CONTACT_INFO)
    }
  };

  const formComponents = {
    [FORM_PAGES.BASIC_INFO]: {
      informationSection: <BasicInfo />,
      formFieldSection: <BasicInfoFormSection updateField={updateField} errors={errors} formFields={FORM_FIELDS} userInfo={userInfo} />
    },
    [FORM_PAGES.CONTACT_INFO]: {
      informationSection: <ContactInfo />,
      formFieldSection: <ContactInfoFormSection updateField={updateField} errors={errors} formFields={FORM_FIELDS} userInfo={userInfo} />
    },
  };

  return (
    <div className="signup-page-content">
      <div className="information-section-container">
        {formComponents[currentFormPage].informationSection}
      </div>
      <div className="form-section-container">
        <div className="form-section-content">
        {formComponents[currentFormPage].formFieldSection}
        </div>
        <div className="progress-bar-section">
          <div className="current-progress"></div>
          <div className="full-progress-bar"></div>
        </div>

        <div className="continue-form-container">
          <button className="stockflow-button signup-form-continue-button" onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  )
}