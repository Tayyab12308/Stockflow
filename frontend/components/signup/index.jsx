import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BasicInfo, BasicInfoFormSection, basicInfoValidations } from "./basic_info";
import { ContactInfo, ContactInfoFormSection, contactInfoValidations } from "./contact_info";
import { FORM_FIELDS, FORM_PAGES } from "./util";
import { IdentityInfo, IdentityInfoFormSection, identityInfoValidations } from "./identity_info";

export default Signup = () => {
  const [currentFormPage, setCurrentFormPage] = useState(FORM_PAGES.IDENTITY_INFO)
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
    [FORM_FIELDS.SOCIAL_SECURITY_NUMBER]: '',
    [FORM_FIELDS.DATE_OF_BIRTH]: '',
    [FORM_FIELDS.CITIZENSHIP]: '',
  });

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
    [FORM_FIELDS.SOCIAL_SECURITY_NUMBER]: '',
    [FORM_FIELDS.DATE_OF_BIRTH]: '',
    [FORM_FIELDS.CITIZENSHIP]: '',
  });

  const updateField = (fieldName) => (e) => setUserInfo(prev => ({ ...prev, [fieldName]: e?.target?.value || '' }));

  const clearErrors = () => setErrors(Object.values(FORM_FIELDS).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {}));

  const validations = {
    [FORM_PAGES.BASIC_INFO]: basicInfoValidations,
    [FORM_PAGES.CONTACT_INFO]: contactInfoValidations,
    [FORM_PAGES.IDENTITY_INFO]: identityInfoValidations,
  };

  const checkValidations = () => Object.keys(validations[currentFormPage]).reduce((acc, curr) => ({
    ...acc,
    [curr]: validations[currentFormPage][curr](userInfo[curr])
  }), {});

  const anyErrors = (errorObject) => Object.values(errorObject).some(e => e);

  const handleContinue = () => {
    clearErrors();
    const newErrors = checkValidations();
    setErrors(prev => ({ ...prev, ...newErrors }));

    if (anyErrors(newErrors)) { return; }

    if (currentFormPage === FORM_PAGES.BASIC_INFO) {
      setCurrentFormPage(FORM_PAGES.CONTACT_INFO);
    } else if (currentFormPage === FORM_PAGES.CONTACT_INFO) {
      setCurrentFormPage(FORM_PAGES.IDENTITY_INFO);
    }
  };

  const formComponents = {
    [FORM_PAGES.BASIC_INFO]: {
      informationSection: <BasicInfo />,
      formFieldSection: <BasicInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 2.5,
    },
    [FORM_PAGES.CONTACT_INFO]: {
      informationSection: <ContactInfo />,
      formFieldSection: <ContactInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 5,
    },
    [FORM_PAGES.IDENTITY_INFO]: {
      informationSection: <IdentityInfo />,
      formFieldSection: <IdentityInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 15,
    }
  };

  return (
    <div className="signup-page-content">
      <div className="information-section-container">
        {formComponents[currentFormPage].informationSection}
      </div>
      <div className="form-section-container">
          {formComponents[currentFormPage].formFieldSection}
        <div className="progress-bar-section">
          <div
            className="current-progress"
            style={{ 
              width: `${formComponents[currentFormPage].completionPercentage}%` 
            }} 
          />
          <div className="full-progress-bar" />
        </div>
        <div className="continue-form-container">
          <button
            className="stockflow-button signup-form-continue-button"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
};
