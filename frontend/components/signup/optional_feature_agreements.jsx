import React from "react";
import { FORM_FIELDS } from "./util";

export const OptionalFeaturesInfo = () => (
  <>
    <img className="signup-stockflow-logo" src={window.stockflowLogo} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Review agreements
      </div>
      <div className="information-section-details">
        Take a few minutes to review these agreements, which go over important details about the services we offer.
      </div>
      <img className="signup-image" src={window.signupTaxInfoImage} />
    </div>
  </>
);

export const OptionalFeaturesFormSection = ({ updateField, userInfo }) => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="scrollable-tax-info">
            <div className="tax-info-header">
              <img className="tax-info-papers-image" src={window.taxPapersInfo} />
              <div className="tax-certification-container">
                <div className="tax-certification-headline">
                  Optional feature agreements
                </div>
                <div className="tax-certification-description">
                  Your account will have the following features unless you opt out.
                </div>
              </div>
            </div>
            <div className="tax-info-body">
              <label className="remember-checkbox-container tax-info-body-item">
                <div className="checkbox-label-text">
                  Stockflow Margin Account Agreement
                </div>
                <input
                  className="login-checkbox-input"
                  onChange={() => updateField(FORM_FIELDS.MARGIN_ACCOUNT)({ target: { value: !userInfo[FORM_FIELDS.MARGIN_ACCOUNT] } })}
                  checked={userInfo[FORM_FIELDS.MARGIN_ACCOUNT]}
                  type="checkbox"
                  required
                />
              </label>
              {userInfo[FORM_FIELDS.MARGIN_ACCOUNT] &&
                <>
                  <div className="tax-certification-description">
                    Uncheck this box to opt out.
                  </div>
                  <div className="tax-info-body-item">
                    Your account will be opened as a margin account which provides access to the following features:
                  </div>
                  <div>
                    <ul className="tax-info-body-item">
                      <li>
                        Trade with Unsettled Funds from Stock and Option Sales. A margin account provides you
                        with access to limited margin privileges, including the ability to trade with unsettled
                        funds gained from selling stocks or options.
                      </li>
                      <li>
                        Access to Certain Options Trading. An margin account allows you to trade additional types of
                        options (subject to approval) on Robinhood that aren't available in a cash account. Certain
                        types of options contracts utilize margin, and carry additional risk for losses beyond your
                        initial investment. To learn more about the risks associated with options, please read the
                        Characteristics and Risks of Standardized Options before you begin trading options.
                      </li>
                    </ul>
                    <div className="tax-info-body-item">
                      If you do not want a margin account, you may opt out by unchecking the box above and your account
                      will be opened as a cash account instead. Terms and conditions for a margin account can be found
                      here: Robinhood Margin Account Agreement.
                    </div>
                  </div>
                </>}
              <label className="remember-checkbox-container tax-info-body-item">
                <div className="checkbox-label-text">
                  Data Sharing Permissions
                </div>
                <input
                  className="login-checkbox-input"
                  onChange={() => updateField(FORM_FIELDS.DATA_SHARING)({ target: { value: !userInfo[FORM_FIELDS.DATA_SHARING] } })}
                  checked={userInfo[FORM_FIELDS.DATA_SHARING]}
                  type="checkbox"
                  required
                />
              </label>
              {userInfo[FORM_FIELDS.DATA_SHARING] &&
                <>
                  <div className="tax-certification-description">
                    Uncheck this box to opt out.
                  </div>
                  <div className="tax-info-body-item">
                    When you allow us to share your personal data with third parties, we can do a better job
                    connecting you with offers and products tailored to you.
                  </div>
                  <div className="tax-info-body-item bold">
                    How do we share personal data?
                  </div>
                  <div className="tax-info-body-item">
                    Robinhood shares personal data with certain non-affiliated third-parties for marketing
                    purposes. We also share personal data with our affiliates for their everyday business
                    purposes and/or marketing. To better understand how we use personal information, be sure
                    to read our Privacy Policy.
                  </div>
                  <div className="tax-info-body-item">
                    If you don't want us to share personal information with these parties, you may opt out by
                    unchecking the box above.
                  </div>
                </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div >
);

export const optionalFeatureValidations = {};
