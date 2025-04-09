import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  EMPLOYMENT_CONFLICT_OPTIONS,
  EMPLOYMENT_OPTIONS_LABELS,
  FAMILY_OPTIONS,
  FormFields,
  formFieldsErrorInitialState,
  formFieldsInitialState,
  OPTIONS_TRADING_AVAILABLE,
  FORM_PAGES,
  FormPage,
  ExperienceOption,
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
import { fundAccountDetailsValidations, FundAccountDetails, FundAccounttDetailsFormSection } from "./fund_account_details";
import { SalaryRangeInfo, SalaryRangeInfoFormSection, salaryRangeValidations } from "./salary_range_info";
import { OptionsTradingInfo, OptionsTradingInfoFormSection, optionsTradingValidations } from "./options_trading_info";
import { EmploymentDetails, EmploymentDetailsFormSection, employmentDetailsValidations } from "./employment_details";
import { EmploymentLocationInfo, EmploymentLocationInfoFormSection, employmentLocationValidations } from "./employment_location_info";
import { signup } from "../../actions/session_actions";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces";
import { AppDispatch } from "../../store";

type FormComponent = {
  informationSection: JSX.Element;
  formFieldSection: JSX.Element;
  completionPercentage: number;
  previousPage: FormPage | null;
  nextPage: FormPage | null;
  validations: Partial<Record<keyof User, (value: any) => string | undefined>>;
  continueButtonText: string;
};

type FormComponents = Record<FormPage, FormComponent>;

const Signup: React.FC = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [currentFormPage, setCurrentFormPage] = useState<FormPage>(FORM_PAGES.BASIC_INFO);
  const [userInfo, setUserInfo] = useState<User>(formFieldsInitialState);
  const [errors, setErrors] = useState<Record<keyof User, string>>(formFieldsErrorInitialState);

  const updateField = <K extends keyof User>(fieldName: K) => (e: React.ChangeEvent<HTMLInputElement>) => setUserInfo(prev => ({ ...prev, [fieldName]: e?.target?.value }));

  const clearErrors = (): void => setErrors(Object.values(FormFields).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {} as Record<keyof User, string>));

  const checkValidations = (): Partial<Record<keyof User, string>> => {
    const validations = formComponents[currentFormPage].validations;
    return Object.entries(validations).reduce((acc, [key, validate]) => {
      const field = key as keyof User;
      const error = validate(userInfo[field]);
      if (error) acc[field] = error;
      return acc;
    }, {} as Partial<Record<keyof User, string>>);
  };

  const anyErrors = (errorObject: Record<string, string | undefined>) => Object.values(errorObject).some(e => e);

  const skipPage = () => formComponents[currentFormPage].nextPage && setCurrentFormPage(formComponents[currentFormPage].nextPage);

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

  const handlePrevious = () => formComponents[currentFormPage].previousPage && setCurrentFormPage(formComponents[currentFormPage].previousPage);

  const formComponents: FormComponents = {
    basicInfo: {
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
    contactInfo: {
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
    identityInfo: {
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
    experienceInfo: {
      informationSection: <ExperienceInfo />,
      formFieldSection: <ExperienceInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 15,
      previousPage: FORM_PAGES.IDENTITY_INFO,
      nextPage: userInfo[FormFields.investingExperience] &&
        typeof userInfo[FormFields.investingExperience] === "string" &&
        OPTIONS_TRADING_AVAILABLE.includes(userInfo[FormFields.investingExperience] as ExperienceOption)
        ? FORM_PAGES.OPTIONS_TRADING_INFO
        : FORM_PAGES.EMPLOYMENT_INFO,
      validations: experienceValidations,
      continueButtonText: 'Continue',
    },
    optionsTradingInfo: {
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
    employmentInfo: {
      informationSection: <EmploymentInfo />,
      formFieldSection: <EmploymentInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 25,
      previousPage: userInfo[FormFields.investingExperience] &&
        typeof userInfo[FormFields.investingExperience] === "string" &&
        OPTIONS_TRADING_AVAILABLE.includes(userInfo[FormFields.investingExperience] as ExperienceOption)
        ? FORM_PAGES.OPTIONS_TRADING_INFO
        : FORM_PAGES.EXPERIENCE_INFO,
      nextPage: FORM_PAGES.SALARY_RANGE_INFO,
      validations: employmentValidations,
      continueButtonText: 'Continue',
    },
    salaryRangeInfo: {
      informationSection: <SalaryRangeInfo />,
      formFieldSection: <SalaryRangeInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 30,
      previousPage: FORM_PAGES.EMPLOYMENT_INFO,
      nextPage: userInfo[FormFields.employmentStatus] === EMPLOYMENT_OPTIONS_LABELS.EMPLOYED.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_DETAILS
        : FORM_PAGES.FAMILY_INFO,
      validations: salaryRangeValidations,
      continueButtonText: 'Continue',
    },
    employmentDetails: {
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
    employmentLocationInfo: {
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
    familyInfo: {
      informationSection: <FamilyInfo />,
      formFieldSection: <FamilyInfoFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 45,
      previousPage: userInfo[FormFields.employmentStatus] === EMPLOYMENT_OPTIONS_LABELS.EMPLOYED.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_LOCATION_INFO
        : FORM_PAGES.SALARY_RANGE_INFO,
      nextPage: userInfo[FormFields.familyStatus] === FAMILY_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.FAMILY_EMPLOYMENT_INFO
        : FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      validations: familyValidations,
      continueButtonText: 'Continue',
    },
    familyEmploymentInfo: {
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
    employmentConflictInfo: {
      informationSection: <EmploymentConflictInfo />,
      formFieldSection: <EmploymentConflictFormSection
        updateField={updateField}
        errors={errors}
        userInfo={userInfo}
      />,
      completionPercentage: 55,
      previousPage: userInfo[FormFields.familyStatus] === FAMILY_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.FAMILY_EMPLOYMENT_INFO
        : FORM_PAGES.FAMILY_INFO,
      nextPage: userInfo[FormFields.employmentConflict] === EMPLOYMENT_CONFLICT_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS
        : FORM_PAGES.TAX_INFO,
      validations: employmentConflictValidations,
      continueButtonText: 'Continue',
    },
    employmentConlfictDetails: {
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
    taxInfo: {
      informationSection: <TaxInfo />,
      formFieldSection: <TaxInfoFormSection
        updateField={updateField}
        userInfo={userInfo}
      />,
      completionPercentage: 65,
      previousPage: userInfo[FormFields.employmentConflict] === EMPLOYMENT_CONFLICT_OPTIONS.YES.toUpperCase()
        ? FORM_PAGES.EMPLOYMENT_CONFLICT_DETAILS
        : FORM_PAGES.EMPLOYMENT_CONFLICT_INFO,
      nextPage: FORM_PAGES.APPLICATION_AGREEMENT_INFO,
      validations: taxInfoValidations,
      continueButtonText: 'Agree and Accept',
    },
    applicationAgreementInfo: {
      informationSection: <ApplicationAgreementInfo />,
      formFieldSection: <ApplicationAgreementFormSection />,
      completionPercentage: 70,
      previousPage: FORM_PAGES.TAX_INFO,
      nextPage: FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS,
      validations: applicationAgreementValidations,
      continueButtonText: 'Agree and Accept',
    },
    optionalFeatureAgreements: {
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
    fundAccountInfo: {
      informationSection: <FundAccountInfo />,
      formFieldSection: <FundAccountInfoFormSection />,
      completionPercentage: 90,
      previousPage: FORM_PAGES.OPTIONAL_FEATURE_AGREEMENTS,
      nextPage: FORM_PAGES.FUND_ACCOUNT_DETAILS,
      validations: fundAccountInfoValidations,
      continueButtonText: 'Fund Account',
    },
    fundAccountDetails: {
      informationSection: <FundAccountDetails />,
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

export default Signup;
