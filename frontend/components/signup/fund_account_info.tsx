import React from "react";
import assetService from "../../services/assetService";

export const FundAccountInfo: React.FC = (): React.JSX.Element => (
  <>
    <img className="signup-stockflow-logo" src={assetService.getImage('stockflowLogo')} />
    <div className="information-section-content">
      <div className="information-section-headline">
        Fund your account
      </div>
      <div className="information-section-details">
        Link your bank account and transfer funds to get more out of Robinhood. It's secure, quick,
        and easy to start with an amount that works for you.
      </div>
      <img className="signup-image" src={assetService.getImage('signupFundAccountImage')} />
    </div>
  </>
);

export const FundAccountInfoFormSection: React.FC = (): React.JSX.Element => (
  <div className="form-section-content fund-account-form-content">
    <div>
      <div className="form-section-info-text">
        Start with as little as $1
      </div>
      <div className="form-section-info-sub-text">
        Transfer funds to your Robinhood individual account so you can start investing right away.
      </div>
      <div className="fund-account-details-container">
        <div className="fund-detail-container">
          <div className="fund-detail-title">
            Budget-friendly
          </div>
          <div className="fund-detail-body">
            Start small and add funds anytime you run low—it only takes a dollar to invest.*
          </div>
        </div>

        <div className="fund-detail-container">
          <div className="fund-detail-title">
            Immediate access to funds
          </div>
          <div className="fund-detail-body">
            Gain access to up to $1,000 in Instant Deposits after you initiate a transfer. Learn more
          </div>
        </div>

        <div className="fund-detail-container">
          <div className="fund-detail-title">
            Account protection
          </div>
          <div className="fund-detail-body">
            Security measures like encryption and two-factor authentication help keep your account secure.
          </div>
        </div>
      </div>
    </div>
    <div className="signup-form-footer">
      <div className="disclaimers-footer experience">
        * Limitations apply. Learn more about fractional shares.
      </div>
    </div>
  </div>
);


export const fundAccountInfoValidations = {};
