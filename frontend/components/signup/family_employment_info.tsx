import React from "react";
import { FormFields, FormFieldsType } from "./util";
import { searchStock } from "../../util/stock_api_util";
import SearchDropdown from "../searchDropdown";
import { SignUpComponentProps } from "./signup.interfaces";
import { SearchResult } from "../searchDropdown/searchDropdown.interfaces";

export const FamilyEmploymentInfo: React.FC = (): React.JSX.Element => (
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

export const FamilyEmploymentInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  errors,
  userInfo,
}: SignUpComponentProps): React.JSX.Element => {
  const handleResult = (selected: SearchResult) => {
    updateField(FormFields.familyEmployment)({ target: { value: selected.symbol }});
  }

  const formatResults = (rawResults: SearchResult[]) => {
    return rawResults.map(result => ({
      name: result.name,
      symbol: result.symbol,
      label: `${result.name} (${result.symbol})`
    }));
  };

  return (
    <div className="form-section-content experience-form-content">
      <div>
        <div className="form-section-info-text">
          Publicly Traded Company
        </div>
        <div className="form-fields-section">
          <div className="input-container">
            <div className="input-container">
              <SearchDropdown
                value={userInfo[FormFields.familyEmployment]}
                onChange={updateField(FormFields.familyEmployment)}
                onResultSelected={handleResult}
                searchFunction={searchStock}
                resultFormatter={formatResults}
                clearOnSelect={false}
                searchBarClassName={`signup-form-input ${errors[FormFields.familyEmployment] ? 'error-field' : ''}`}       // custom class for search bar
                resultsContainerClassName="my-search-results" // custom class for dropdown results
                searchResultItemClassName="stacked-result"
                placeholder="Stock symbol of company"
              />
              {errors[FormFields.familyEmployment] && <div className="signup-form-field-error">
                {errors[FormFields.familyEmployment]}
              </div>}
            </div>
          </div>
        </div>
      </div>
      <div className="signup-form-footer">
        <div className="disclaimers-footer experience">
          Stockflow is required by law to collect this information to help prevent insider trading.
        </div>
      </div>
    </div>
  )
};

export type FamilyEmploymentValidation = {
  [key in keyof Pick<FormFieldsType, 'familyEmployment'>]: (value: string) => string | undefined;
};

export const familyEmploymentValidations = {
  familyEmployment: (familyEmployment: string): string | undefined => {
    if (familyEmployment.length <= 0) {
      return 'Please enter your family employment';
    };
  },
};
