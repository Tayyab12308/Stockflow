import React, { useState } from "react";
import { FormFields } from "./util";
import Flyout from "../flyout";
import { SignUpComponentProps } from "./signup.interfaces";
import assetService from "../../services/assetService";

export const TaxInfo: React.FC = (): React.JSX.Element => (
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

export const TaxInfoFormSection: React.FC<SignUpComponentProps> = ({
  updateField,
  userInfo,
}: SignUpComponentProps): React.JSX.Element => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked: boolean = e.target.checked;

    if (!checked) {
      setFlyoutOpen(true);
    } else {
      updateField(FormFields.reportedAllIncome)({ target: { value: true } })
    }
  }

  return (
    <div className="form-section-content experience-form-content">
      <div>
        <div className="form-fields-section">
          <div className="input-container">
            <div className="scrollable-tax-info">
              <div className="tax-info-header">
                <img className="tax-info-papers-image" src={assetService.getImage('taxPapersInfo')} />
                <div className="tax-certification-container">
                  <div className="tax-certification-headline">
                    Tax certification
                  </div>
                  <div className="tax-certification-description">
                    This is the agreement for your W-9, a form used for tax reporting.
                    Agreeing means you confirm that the information you provided is accurate.
                  </div>
                </div>
              </div>
              <div className="tax-info-body">
                <div className="tax-info-body-item">
                  If you have any questions, our Help Center has more information.
                </div>
                <div className="tax-info-body-item bold">
                  Agreement
                </div>
                <div className="tax-info-body-item">
                  Under penalties of perjury, I certify that:
                </div>
                <div>
                  <ol type="1" className="tax-info-body-item">
                    <li>
                      The social security number (SSN) previously provided is correct.
                    </li>
                    <li>
                      I am not subject to backup withholding because: a. I have not been
                      notified by the IRS that I have failed to report all interest or dividends,
                      or b. the IRS has notified me that I am no longer subject to backup withholding.
                    </li>
                    <li>
                      I am a US citizen or permanent resident or other US person for tax purposes.
                      <a
                        href="https://www.irs.gov/individuals/international-taxpayers/classification-of-taxpayers-for-us-tax-purposes"
                        target="_blank"
                        className="tax-info-link"
                      >
                        What is a US person?
                      </a>
                    </li>
                    <li>
                      The
                      <a
                        href="https://www.irs.gov/businesses/corporations/summary-of-key-fatca-provisions"
                        target="_blank"
                        className="tax-info-link"
                      >
                        FATCA
                      </a>
                      code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting
                      is correct. (Note: We are legally required to present this FATCA statement here, but it
                      is not applicable to Stockflow customers because Stockflow accounts are US-based.)
                    </li>
                  </ol>
                  <label className="remember-checkbox-container tax-info-body-item">
                    <div className="checkbox-label-text">
                      If you have been notified by the IRS that you are subject to backup withholding because
                      you have failed to report all interest or dividends on your tax return, and thus cannot
                      make any of the representations in 2 above, uncheck this box.
                    </div>
                    <input className="login-checkbox-input" onChange={handleCheckbox} checked={userInfo[FormFields.reportedAllIncome]} type="checkbox" required />
                  </label>
                  <Flyout
                    open={flyoutOpen}
                    onClose={() => setFlyoutOpen(false)}
                    buttons={[
                      { text: "I have NOT received a Notice from the IRS", className: "ok-btn", onClick: () => updateField(FormFields.reportedAllIncome)({ target: { value: true } }) },
                      { text: "I have received a Notice from the IRS", className: "inverted", onClick: () => updateField(FormFields.reportedAllIncome)({ target: { value: false } }) },
                    ]}
                    title="Are you sure you need to uncheck the box?"
                    body="You only need to uncheck the box if you have been notified by the IRS that you are subject to backup
                            withholding because you failed to report all interest and dividends on your tax return. The IRS only
                            sends taxpayers these notifications in very rare circumstances. If you uncheck the box, Stockflow
                            would have to withhold 24% on any payments of dividends or interest that you receive. If you
                            haven't received a CP539 or CP541 notice, this situation probably doesn't apply to you."
                  />
                  <div className="tax-info-body-item bold">
                    Certification instructions
                  </div>
                  <div className="tax-info-body-item">
                    Do not uncheck the box above unless you've been notified by the IRS that you are subject
                    to backup withholding because you failed to report all interest and dividends on your tax
                    return.
                  </div>
                  <div className="tax-info-body-item">
                    If your SSN is incorrect, please go back and retype your SSN into the input screen.
                  </div>
                  <div className="tax-info-body-item bold">
                    The Internal Revenue Service does not require your consent to any provision of this document
                    other than the certifications required to prevent backup withholding.
                  </div>
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
  )
};


export const taxInfoValidations = {};
