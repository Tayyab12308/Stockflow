import React from "react";
import { FORM_FIELDS } from "./util";
import { searchStock } from "../../util/stock_api_util";
import SearchDropdown from "../search_dropdown";

export const FamilyEmploymentInfo = () => (
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

export const FamilyEmploymentInfoFormSection = ({ updateField, errors, userInfo }) => {
  const handleResult = (selected) => {
    updateField(FORM_FIELDS.FAMIlY_EMPLOYMENT)({ target: { value: selected.symbol }});
  }

  const formatResults = (rawResults) => {
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
                value={userInfo[FORM_FIELDS.FAMIlY_EMPLOYMENT]}
                onChange={updateField(FORM_FIELDS.FAMIlY_EMPLOYMENT)}
                onResultSelected={handleResult}
                searchFunction={searchStock}
                resultFormatter={formatResults}
                clearOnSelect={false}
                searchBarClassName={`signup-form-input ${errors[FORM_FIELDS.FAMIlY_EMPLOYMENT] ? 'error-field' : ''}`}       // custom class for search bar
                resultsContainerClassName="my-search-results" // custom class for dropdown results
                searchResultItemClassName="stacked-result"
                placeholder="Stock symbol of company"
              />
              {errors[FORM_FIELDS.FAMIlY_EMPLOYMENT] && <div className="signup-form-field-error">
                {errors[FORM_FIELDS.FAMIlY_EMPLOYMENT]}
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

export const familyEmploymentValidations = {
  [FORM_FIELDS.FAMIlY_EMPLOYMENT]: (familyStatus) => {
    if (familyStatus.length <= 0) {
      return 'Please enter your family employment';
    };
  },
};
