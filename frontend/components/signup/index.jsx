import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  EMPLOYMENT_CONFLICT_OPTIONS,
  EMPLOYMENT_OPTIONS,
  FAMILY_OPTIONS,
  FORM_FIELDS,
  FORM_PAGES,
  formFieldsErrorInitialState,
  formFieldsInitialState,
  OPTIONS_TRADING_AVAILABLE,
} from "./util";
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
import { SalaryRangeInfo, SalaryRangeInfoFormSection, salaryRangeValidations } from "./salary_range_info";
import { OptionsTradingInfo, OptionsTradingInfoFormSection, optionsTradingValidations } from "./options_trading_info";
import { EmploymentDetails, EmploymentDetailsFormSection, employmentDetailsValidations } from "./employment_details";
import { EmploymentLocationInfo, EmploymentLocationInfoFormSection, employmentLocationValidations } from "./employment_location_info";
import { signup } from "../../util/session_api_util";
import { useNavigate } from "react-router-dom";

export default Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentFormPage, setCurrentFormPage] = useState(FORM_PAGES.BASIC_INFO)
  const [userInfo, setUserInfo] = useState(formFieldsInitialState);
  const [errors, setErrors] = useState(formFieldsErrorInitialState);

  const updateField = (fieldName) => (e) => setUserInfo(prev => ({ ...prev, [fieldName]: e?.target?.value || '' }));

  const clearErrors = () => setErrors(Object.values(FORM_FIELDS).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {}));

  const checkValidations = () => Object.keys(formComponents[currentFormPage].validations).reduce((acc, curr) => ({
    ...acc,
    [curr]: formComponents[currentFormPage].validations[curr](userInfo[curr])
  }), {});

  const anyErrors = (errorObject) => Object.values(errorObject).some(e => e);

  const skipPage = () => setCurrentFormPage(formComponents[currentFormPage].nextPage);

  const handleContinue = () => {
    clearErrors();
    const newErrors = checkValidations();
    setErrors(prev => ({ ...prev, ...newErrors }));

    if (anyErrors(newErrors)) { return; }

    if (formComponents[currentFormPage].nextPage) {
      setCurrentFormPage(formComponents[currentFormPage].nextPage)
    } else {
      dispatch(signup(userInfo)).then(() => navigate("/dashboard"));
    }
  };

  const handlePrevious = () => setCurrentFormPage(formComponents[currentFormPage].previousPage);

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
      validations: basicInfoValidations,
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
      validations: contactInfoValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.IDENTITY_INFO]: {
      informationSection: <IdentityInfo />,
      formFieldSection: <IdentityInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 10,
      previousPage: FORM_PAGES.CONTACT_INFO,
      nextPage: FORM_PAGES.EXPERIENCE_INFO,
      validations: identityInfoValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EXPERIENCE_INFO]: {
      informationSection: <ExperienceInfo />,
      formFieldSection: <ExperienceInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 15,
      previousPage: FORM_PAGES.IDENTITY_INFO,
      nextPage: OPTIONS_TRADING_AVAILABLE.includes(userInfo[FORM_FIELDS.INVESTING_EXPERIENCE])
        ? FORM_PAGES.OPTIONS_TRADING_INFO
        : FORM_PAGES.EMPLOYMENT_INFO,
      validations: experienceValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.OPTIONS_TRADING_INFO]: {
      informationSection: <OptionsTradingInfo />,
      formFieldSection: <OptionsTradingInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 20,
      previousPage: FORM_PAGES.EXPERIENCE_INFO,
      nextPage: FORM_PAGES.EMPLOYMENT_INFO,
      validations: optionsTradingValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_INFO]: {
      informationSection: <EmploymentInfo />,
      formFieldSection: <EmploymentInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 25,
      previousPage: OPTIONS_TRADING_AVAILABLE.includes(userInfo[FORM_FIELDS.INVESTING_EXPERIENCE])
        ? FORM_PAGES.OPTIONS_TRADING_INFO
        : FORM_PAGES.EXPERIENCE_INFO,
      nextPage: FORM_PAGES.SALARY_RANGE_INFO,
      validations: employmentValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.SALARY_RANGE_INFO]: {
      informationSection: <SalaryRangeInfo />,
      formFieldSection: <SalaryRangeInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 30,
      previousPage: FORM_PAGES.EMPLOYMENT_INFO,
      nextPage: userInfo[FORM_FIELDS.EMPLOYMENT_STATUS] === EMPLOYMENT_OPTIONS.EMPLOYED.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_DETAILS
        : FORM_PAGES.FAMILY_INFO,
      validations: salaryRangeValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_DETAILS]: {
      informationSection: <EmploymentDetails />,
      formFieldSection: <EmploymentDetailsFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 35,
      previousPage: FORM_PAGES.SALARY_RANGE_INFO,
      nextPage: FORM_PAGES.EMPLOYMENT_LOCATION_INFO,
      validations: employmentDetailsValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_LOCATION_INFO]: {
      informationSection: <EmploymentLocationInfo />,
      formFieldSection: <EmploymentLocationInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
        skipPage={skipPage}
      />,
      completionPercentage: 40,
      previousPage: FORM_PAGES.EMPLOYMENT_DETAILS,
      nextPage: FORM_PAGES.FAMILY_INFO,
      validations: employmentLocationValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.FAMILY_INFO]: {
      informationSection: <FamilyInfo />,
      formFieldSection: <FamilyInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 45,
      previousPage: userInfo[FORM_FIELDS.EMPLOYMENT_STATUS] === EMPLOYMENT_OPTIONS.EMPLOYED.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_LOCATION_INFO
        : FORM_PAGES.SALARY_RANGE_INFO,
      nextPage: userInfo[FORM_FIELDS.FAMILY_STATUS] === FAMILY_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.FAMILY_EMPLOYMENT_INFO
        : FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      validations: familyValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.FAMILY_EMPLOYMENT_INFO]: {
      informationSection: <FamilyEmploymentInfo />,
      formFieldSection: <FamilyEmploymentInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 50,
      previousPage: FORM_PAGES.FAMILY_INFO,
      nextPage: FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      validations: familyEmploymentValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_CONFLICT_INFO]: {
      informationSection: <EmploymentConflictInfo />,
      formFieldSection: <EmploymentConflictFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 55,
      previousPage: userInfo[FORM_FIELDS.FAMILY_STATUS] === FAMILY_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.FAMILY_EMPLOYMENT_INFO
        : FORM_PAGES.FAMILY_INFO,
      nextPage: userInfo[FORM_FIELDS.EMPLOYMENT_CONFLICT] === EMPLOYMENT_CONFLICT_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS
        : FORM_PAGES.TAX_INFO,
      validations: employmentConflictValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS]: {
      informationSection: <EmploymentConflictDetails />,
      formFieldSection: <EmploymentConflictDetailsFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 60,
      previousPage: FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      nextPage: FORM_PAGES.TAX_INFO,
      validations: conflictDetailsValidations,
      continueButtonText: 'Continue',
    },
    [FORM_PAGES.TAX_INFO]: {
      informationSection: <TaxInfo />,
      formFieldSection: <TaxInfoFormSection
        updateField={updateField}
        userInfo={userInfo}
      />,
      completionPercentage: 65,
      previousPage: userInfo[FORM_FIELDS.EMPLOYMENT_CONFLICT] === EMPLOYMENT_CONFLICT_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS
        : FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      nextPage: FORM_PAGES.APPLICATION_AGREEMENT_INFO,
      validations: taxInfoValidations,
      continueButtonText: 'Agree and Accept',
    },
    [FORM_PAGES.APPLICATION_AGREEMENT_INFO]: {
      informationSection: <ApplicationAgreementInfo />,
      formFieldSection: <ApplicationAgreementFormSection />,
      completionPercentage: 70,
      previousPage: FORM_PAGES.TAX_INFO,
      nextPage: FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS,
      validations: applicationAgreementValidations,
      continueButtonText: 'Agree and Accept',
    },
    [FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS]: {
      informationSection: <OptionalFeaturesInfo />,
      formFieldSection: <OptionalFeaturesFormSection
        updateField={updateField}
        userInfo={userInfo}
      />,
      completionPercentage: 80,
      previousPage: FORM_PAGES.APPLICATION_AGREEMENT_INFO,
      nextPage: FORM_PAGES.FUND_ACCOUNT_INFO,
      validations: optionalFeatureValidations,
      continueButtonText: 'Agree to selected features',
    },
    [FORM_PAGES.FUND_ACCOUNT_INFO]: {
      informationSection: <FundAccountInfo />,
      formFieldSection: <FundAccountInfoFormSection />,
      completionPercentage: 90,
      previousPage: FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS,
      nextPage: FORM_PAGES.FUND_ACCOUNT_DETAILS,
      validations: fundAccountInfoValidations,
      continueButtonText: 'Fund Account',
    },
    [FORM_PAGES.FUND_ACCOUNT_DETAILS]: {
      informationSection: <FundAccounttDetails />,
      formFieldSection: <FundAccounttDetailsFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 95,
      previousPage: FORM_PAGES.FUND_ACCOUNT_INFO,
      nextPage: null,
      validations: fundAccountDetailsValidations,
      continueButtonText: 'Submit and Create Account',
    },
  };

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
