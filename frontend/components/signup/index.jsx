import React, { useState } from "react";
import { Link } from "react-router-dom";
import { EMPLYMENT_CONFLICT_OPTIONS, FAMILY_OPTIONS, FORM_FIELDS, FORM_PAGES } from "./util";
import { BasicInfo, BasicInfoFormSection, basicInfoValidations } from "./basic_info";
import { ContactInfo, ContactInfoFormSection, contactInfoValidations } from "./contact_info";
import { IdentityInfo, IdentityInfoFormSection, identityInfoValidations } from "./identity_info";
import { ExperienceInfo, ExperienceInfoFormSection, experienceValidations } from "./experience_info";
import { EmploymentInfo, EmploymentInfoFormSection, employmentValidations } from "./employment_info";
import { FamilyInfo, FamilyInfoFormSection, familyValidations } from "./family_info";
import { FamilyEmploymentInfo, FamilyEmploymentInfoFormSection, familyEmploymentValidations } from "./family_employment_info";
import { EmploymentConflictFormSection, EmploymentConflictInfo, employmentConflictValidations } from "./employment_conflict_info";
import { conflictDetailsValidations, EmploymentConflictDetails, EmploymentConflictDetailsFormSection } from "./employment_conflict_details";
import { TaxInfo, TaxInfoFormSection, taxInfoValidations } from "./tax_info";
import { ApplicationAgreementFormSection, ApplicationAgreementInfo, applicationAgreementValidations } from "./application_agreement_info";
import { OptionalFeaturesFormSection, OptionalFeaturesInfo, optionalFeatureValidations } from "./optional_feature_agreements";
import { FundAccountInfo, FundAccountInfoFormSection, fundAccountInfoValidations } from "./fund_account_info";
import { fundAccountDetailsValidations, FundAccounttDetails, FundAccounttDetailsFormSection } from "./fund_account_details";
import { useDispatch } from "react-redux";
import { signup } from "../../util/session_api_util";

export default Signup = () => {
  const dispatch = useDispatch();
  const [currentFormPage, setCurrentFormPage] = useState(FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS)
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
    [FORM_FIELDS.INVESTING_EXPERIENCE]: '',
    [FORM_FIELDS.EMPLOYMENT_STATUS]: '',
    [FORM_FIELDS.FAMILY_STATUS]: '',
    [FORM_FIELDS.FAMIlY_EMPLOYMENT]: '',
    [FORM_FIELDS.CONFLICT_FIRM_NAME]: '',
    [FORM_FIELDS.CONFLICT_EMPLOYEE_NAME]: '',
    [FORM_FIELDS.CONFLICT_RELATIONSHIP]: '',
    [FORM_FIELDS.REPORTED_ALL_INCOME]: true,
    [FORM_FIELDS.MARGIN_ACCOUNT]: true,
    [FORM_FIELDS.DATA_SHARING]: true,
    [FORM_FIELDS.ACCOUNT_FUNDS]: null,
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
    [FORM_FIELDS.INVESTING_EXPERIENCE]: '',
    [FORM_FIELDS.EMPLOYMENT_STATUS]: '',
    [FORM_FIELDS.FAMILY_STATUS]: '',
    [FORM_FIELDS.FAMIlY_EMPLOYMENT]: '',
    [FORM_FIELDS.CONFLICT_FIRM_NAME]: '',
    [FORM_FIELDS.CONFLICT_EMPLOYEE_NAME]: '',
    [FORM_FIELDS.CONFLICT_RELATIONSHIP]: '',
    [FORM_FIELDS.ACCOUNT_FUNDS]: '',
  });

  const updateField = (fieldName) => (e) => setUserInfo(prev => ({ ...prev, [fieldName]: e?.target?.value || '' }));

  const clearErrors = () => setErrors(Object.values(FORM_FIELDS).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {}));

  const validations = {
    [FORM_PAGES.BASIC_INFO]: basicInfoValidations,
    [FORM_PAGES.CONTACT_INFO]: contactInfoValidations,
    [FORM_PAGES.IDENTITY_INFO]: identityInfoValidations,
    [FORM_PAGES.EXPERIENCE_INFO]: experienceValidations,
    [FORM_PAGES.EMPLOYMENT_INFO]: employmentValidations,
    [FORM_PAGES.FAMILY_INFO]: familyValidations,
    [FORM_PAGES.FAMILY_EMPLOYMENT_INFO]: familyEmploymentValidations,
    [FORM_PAGES.EMPLOYMENT_CONFLICT_INFO]: employmentConflictValidations,
    [FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS]: conflictDetailsValidations,
    [FORM_PAGES.TAX_INFO]: taxInfoValidations,
    [FORM_PAGES.APPLICATION_AGREEMENT_INFO]: applicationAgreementValidations,
    [FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS]: optionalFeatureValidations,
    [FORM_PAGES.FUND_ACCOUNT_INFO]: fundAccountInfoValidations,
    [FORM_PAGES.FUND_ACCOUNT_DETAILS]: fundAccountDetailsValidations,
  };

  const checkValidations = () => Object.keys(validations[currentFormPage]).reduce((acc, curr) => ({
    ...acc,
    [curr]: validations[currentFormPage][curr](userInfo[curr])
  }), {});

  const anyErrors = (errorObject) => Object.values(errorObject).some(e => e);

  const formComponents = {
    [FORM_PAGES.BASIC_INFO]: {
      informationSection: <BasicInfo />,
      formFieldSection: <BasicInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 2.5,
      previousPage: null,
      nextPage: FORM_PAGES.CONTACT_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.CONTACT_INFO]: {
      informationSection: <ContactInfo />,
      formFieldSection: <ContactInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 5,
      previousPage: FORM_PAGES.BASIC_INFO,
      nextPage: FORM_PAGES.IDENTITY_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.IDENTITY_INFO]: {
      informationSection: <IdentityInfo />,
      formFieldSection: <IdentityInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 15,
      previousPage: FORM_PAGES.CONTACT_INFO,
      nextPage: FORM_PAGES.EXPERIENCE_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EXPERIENCE_INFO]: {
      informationSection: <ExperienceInfo />,
      formFieldSection: <ExperienceInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 40,
      previousPage: FORM_PAGES.IDENTITY_INFO,
      nextPage: FORM_PAGES.EMPLOYMENT_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_INFO]: {
      informationSection: <EmploymentInfo />,
      formFieldSection: <EmploymentInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 50,
      previousPage: FORM_PAGES.EXPERIENCE_INFO,
      nextPage: FORM_PAGES.FAMILY_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.FAMILY_INFO]: {
      informationSection: <FamilyInfo />,
      formFieldSection: <FamilyInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 65,
      previousPage: FORM_PAGES.EMPLOYMENT_INFO,
      nextPage: userInfo[FORM_FIELDS.FAMILY_STATUS] === FAMILY_OPTIONS.yes.toLowerCase()
        ? FORM_PAGES.FAMILY_EMPLOYMENT_INFO
        : FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.FAMILY_EMPLOYMENT_INFO]: {
      informationSection: <FamilyEmploymentInfo />,
      formFieldSection: <FamilyEmploymentInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 70,
      previousPage: FORM_PAGES.FAMILY_INFO,
      nextPage: FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_CONFLICT_INFO]: {
      informationSection: <EmploymentConflictInfo />,
      formFieldSection: <EmploymentConflictFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 75,
      previousPage: userInfo[FORM_FIELDS.FAMILY_STATUS] === FAMILY_OPTIONS.yes.toLowerCase()
        ? FORM_PAGES.FAMILY_EMPLOYMENT_INFO
        : FORM_PAGES.FAMILY_INFO,
      nextPage: userInfo[FORM_FIELDS.EMPLOYMENT_CONFLICT] === EMPLYMENT_CONFLICT_OPTIONS.yes.toLowerCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS
        : FORM_PAGES.TAX_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS]: {
      informationSection: <EmploymentConflictDetails />,
      formFieldSection: <EmploymentConflictDetailsFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 80,
      previousPage: userInfo[FORM_FIELDS.FAMILY_STATUS] === FAMILY_OPTIONS.yes.toLowerCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_INFO
        : FORM_PAGES.FAMILY_EMPLOYMENT_INFO,
      nextPage: FORM_PAGES.TAX_INFO,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.TAX_INFO]: {
      informationSection: <TaxInfo />,
      formFieldSection: <TaxInfoFormSection
        updateField={updateField}
        userInfo={userInfo}
      />,
      completionPercentage: 90,
      previousPage: userInfo[FORM_FIELDS.FAMILY_STATUS] === FAMILY_OPTIONS.yes.toLowerCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_INFO
        : FORM_PAGES.FAMILY_EMPLOYMENT_INFO,
      nextPage: FORM_PAGES.APPLICATION_AGREEMENT_INFO,
      continueButtonText: 'Agree and Accept',
    },
    [FORM_PAGES.APPLICATION_AGREEMENT_INFO]: {
      informationSection: <ApplicationAgreementInfo />,
      formFieldSection: <ApplicationAgreementFormSection />,
      completionPercentage: 95,
      previousPage: FORM_PAGES.TAX_INFO,
      nextPage: FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS,
      continueButtonText: 'Agree and Accept',
    },
    [FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS]: {
      informationSection: <OptionalFeaturesInfo />,
      formFieldSection: <OptionalFeaturesFormSection
        updateField={updateField}
        userInfo={userInfo}
      />,
      completionPercentage: 97.5,
      previousPage: FORM_PAGES.APPLICATION_AGREEMENT_INFO,
      nextPage: FORM_PAGES.FUND_ACCOUNT_INFO,
      continueButtonText: 'Agree to selected features',
    },
    [FORM_PAGES.FUND_ACCOUNT_INFO]: {
      informationSection: <FundAccountInfo />,
      formFieldSection: <FundAccountInfoFormSection />,
      completionPercentage: 98,
      previousPage: FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS,
      nextPage: FORM_PAGES.FUND_ACCOUNT_DETAILS,
      continueButtonText: 'Fund Account',
    },
    [FORM_PAGES.FUND_ACCOUNT_DETAILS]: {
      informationSection: <FundAccounttDetails />,
      formFieldSection: <FundAccounttDetailsFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 99.9,
      previousPage: FORM_PAGES.FUND_ACCOUNT_INFO,
      nextPage: null,
      continueButtonText: 'Submit and Create Account',
    },
  };

  const handleContinue = () => {
    clearErrors();
    const newErrors = checkValidations();
    setErrors(prev => ({ ...prev, ...newErrors }));

    if (anyErrors(newErrors)) { return; }

    if (formComponents[currentFormPage].nextPage) {
      setCurrentFormPage(formComponents[currentFormPage].nextPage)
    } else {
      dispatch(signup(userInfo))
    }
  };

  const handlePrevious = () => setCurrentFormPage(formComponents[currentFormPage].previousPage);

  return (
    <div className="signup-page-content">
      <div className="information-section-container">
        {formComponents[currentFormPage].informationSection}
      </div>
      <div className="form-section-container">
        <div className="form-section-scrollable-form-content">
          {formComponents[currentFormPage].formFieldSection}
        </div>
        <div className="form-section-sticky-footer">
          <div className="progress-bar-section">
            <div
              className="current-progress"
              style={{
                width: `${formComponents[currentFormPage].completionPercentage}%`
              }}
            />
            <div className="full-progress-bar" />
          </div>
          <div className="continue-form-container flex-button">
            {formComponents[currentFormPage].previousPage && <button
              className="signup-form-previous-button"
              onClick={handlePrevious}
            >
              <svg fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.619 3.618 7.382 2.381 1.762 8l5.62 5.618 1.237-1.237-3.506-3.507H14v-1.75H5.113l3.506-3.507Z"
                  fill="white">
                </path>
              </svg>
              Back
            </button>}
            <button
              className="stockflow-button signup-form-continue-button"
              onClick={handleContinue}
            >
              {formComponents[currentFormPage].continueButtonText}
            </button>
          </div>
        </div>
      </div>
      <div className="continue-form-container bottom-sticky-continue-button">
        <button
          className="stockflow-button signup-form-continue-button"
          onClick={handleContinue}
        >
          {formComponents[currentFormPage].continueButtonText}
        </button>
      </div>
    </div>
  )
};
