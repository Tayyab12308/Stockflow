import React from "react";
import assetService from "../../services/assetService";

export const ApplicationAgreementInfo: React.FC = (): React.JSX.Element => (
  <>
    <img className="signup-stockflow-logo" src={assetService.getImage('stockflowLogo')} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Review agreements
      </div>
      <div className="information-section-details">
        Take a few minutes to review these agreements, which go over important details about the services we offer.
      </div>
      <img className="signup-image" src={assetService.getImage('signupTaxInfoImage')} />
    </div>
  </>
);

export const ApplicationAgreementFormSection: React.FC = (): React.JSX.Element => (
  <div className="form-section-content experience-form-content">
    <div>
      <div className="form-fields-section">
        <div className="input-container">
          <div className="scrollable-tax-info">
            <div className="tax-info-header">
              <img className="tax-info-papers-image" src={assetService.getImage('applicationAgreementInfo')} />
              <div className="tax-certification-container">
                <div className="tax-certification-headline">
                  Application agreement
                </div>
                <div className="tax-certification-description">
                  This agreement includes our terms of use and important policies.
                </div>
              </div>
            </div>
            <div className="tax-info-body">
              <div className="tax-info-body-item bold tall">
                Application Agreement
              </div>
              <div className="tax-info-body-item bold">
                Electronic Delivery of Documents
              </div>
              <div className="tax-info-body-item">
                By tapping or clicking the "Agree" button below, you agree that you accept electronic
                delivery of the following documents, and that you have carefully reviewed and agree to
                the terms of each and will retain copies for your records:
              </div>
              <div>
                <ul className="tax-info-body-item-ul">
                  <li className="form-agreement-item">
                    Form CRS (Customer Relationship Summary)
                  </li>
                  <li className="form-agreement-item">
                    RHF-RHS Customer Agreement
                  </li>
                  <li className="form-agreement-item">
                    Stockflow Margin Account Agreement
                  </li>
                  <li className="form-agreement-item">
                    Stockflow Terms and Conditions
                  </li>
                  <li className="form-agreement-item">
                    RHF Use and Risk Disclosures, RHF Business Continuity Plan Summary, and FINRA Public Disclosure Program
                  </li>
                  <li className="form-agreement-item">
                    Stockflow Privacy Policy and Financial Privacy Notice
                  </li>
                </ul>
                <div className="tax-info-body-item">
                  The documents listed above, in addition to the Account Terms and Conditions, below,
                  constitute the “Application Agreement.” Capitalized, undefined terms in this Application
                  Agreement have the meaning given in the RHF-RHS Customer Agreement.
                </div>
                <div className="tax-info-body-item bold tall">
                  Account Terms and Conditions
                </div>
                <div className="tax-info-body-item bold">
                  You represent and warrant that:
                </div>
                <ul className="tax-info-body-item-ul">
                  <li>
                    You are the person identified in this Account Application, and all of the
                    information you have provided in this Account Application is accurate; Stockflow
                    can rely on such information; and you agree to notify Stockflow promptly regarding
                    any change in such information.
                  </li>
                </ul>
                <div className="tax-info-body-item bold">
                  You agree that:
                </div>
                <ul className="tax-info-body-item-ul">
                  <li>
                    You consent to electronic delivery of all future brokerage account information as
                    described in the RHF-RHS Customer Agreement.
                  </li>
                  <li>
                    You understand that Stockflow will supply your name to issuers of any securities held
                    in your Account so that you might receive any important information from the issuers
                    regarding the securities, unless you notify Stockflow in writing not to do so by
                    sending an email to support@stockflow.com with "Rule 14b-1(c) objection" in the subject.
                  </li>
                  <li>
                    You authorize Stockflow to verify, and re-verify as necessary, all information provided
                    in this Account Application to comply with our regulatory obligations.
                  </li>
                  <li>
                    Tapping or clicking the "Agree" button below is equivalent to your written signature,
                    and you understand that you are entering into legal agreements.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            By clicking the "Agree and Accept" button below, I declare that I have examined the information
            and to the best of my knowledge and belief it is true, correct, and complete and I understand
            that I am signing an electronic Form W-9.
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const applicationAgreementValidations = {};
