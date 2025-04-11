import React, { memo } from 'react';
import { formatNumber } from '../../../util/util';

interface CompanyInfoProps {
  companyProfile: any;
  info: any;
  keyStats: any;
}

const CompanyInfo: React.FC<CompanyInfoProps> = memo(({ companyProfile, info, keyStats }) => {
  return (
    <div className="stock-info">
      <hr />
      <h2>About</h2>
      <hr />
      <div className="stock-description">
        {companyProfile?.description}
      </div>
      <div className="info-subsets">
        <div className="info-row">
          <div>
            <div className="info-subheader">CEO</div> <br />
            {companyProfile?.ceo}
          </div>
          <div>
            <div className="info-subheader">Employees</div> <br />
            {companyProfile?.fullTimeEmployees}
          </div>
          <div>
            <div className="info-subheader">Headquarters</div> <br />
            {companyProfile?.city}, {companyProfile?.country}
          </div>
          <div>
            <div className="info-subheader">Market Cap</div> <br />
            {formatNumber(companyProfile?.mktCap)}
          </div>
        </div>
        <div className="info-row">
          <div>
            <div className="info-subheader">Price-Earnings Ratio</div> <br />
            {info?.PERatio}
          </div>
          <div>
            <div className="info-subheader">Average Volume</div> <br />
            {formatNumber(companyProfile?.volAvg)}
          </div>
          <div>
            <div className="info-subheader">High Today</div> <br />
            {keyStats?.["03. high"] || ''}
          </div>
          <div>
            <div className="info-subheader">Low Today</div> <br />
            {keyStats?.["04. low"]}
          </div>
        </div>
        <div className="info-row">
          <div>
            <div className="info-subheader">Open Price</div> <br />
            {keyStats?.["02. open"]}
          </div>
          <div>
            <div className="info-subheader">Volume</div> <br />
            {formatNumber(keyStats?.["06. volume"])}
          </div>
          <div>
            <div className="info-subheader">52 Week High</div> <br />
            ${info?.["52WeekHigh"]}
          </div>
          <div>
            <div className="info-subheader">52 Week Low</div> <br />
            ${info?.["52WeekLow"]}
          </div>
        </div>
      </div>
      <div>
        <h2>News</h2>
        <hr />
      </div>
    </div>
  );
});

export default CompanyInfo;
