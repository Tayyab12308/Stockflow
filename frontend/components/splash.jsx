import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Splash = () => {
  return (
    <div className='splash-page-content'>
      <div className='retirement-section'>
        <video className='retirement-background' autoPlay loop muted playsInline preload="auto">
          <source src={window.stockflowRetirementBackground} type="video/webm" />
        </video>
        <div className='retirement-text'>
          <div className='retirement-text-container'>
            <h1 className='stockflow-retirement-logo'>Stockflow Retirement</h1>
            <div className='retirement-text-separator'></div>
            <div className='retirement-headline'>Progress is&nbsp;gold. Get&nbsp;an IRA boost.</div>
            <div className='retirement-text-separator'></div>
            <div className='retirement-disclosure'>Subscription and limitations apply (Gold $5/month)</div>
            <div className='retirement-text-separator'></div>
            <Link to="/retirement" className="retirement-get-started">Get Started</Link>
          </div>
        </div>
      </div>
      <div className='stockflow-gold-section'>
        <img className='stockflow-gold-background' src={window.stockflowGoldBackground} />
        <div className='stockflow-gold-text'>
          <div className='stockflow-gold-text-container'>
            <div className='stockflow-gold-info'>
              With Stockflow Gold, get a 3% IRA boost of up to $420 when you max out your 2024 contributions by April 15th—and stack on your max contributions for 2025. Non-Gold? Enjoy a 1% match.
            </div>
            <div className='retirement-text-separator'></div>
            <div className='stockflow-gold-info'>
              You can also transfer any IRA or old 401(k) by April 30th for unlimited 2% match potential.
            </div>
            <div className='retirement-text-separator'></div>
            <div className='retirement-disclosure'>Subscription and limitations apply (Gold $5/month)</div>
          </div>
        </div>
      </div>
      <div className='investing-section'>
        <picture className='investing-background'>
          <source className='investing-background' media="(min-width: 1280px)" srcSet={window.investingHeroLargeBackground} />
          <source className='investing-background' media="(max-width: 425px)" srcSet={window.investingHeroSmallBackground} />
          <source className='investing-background' media="(max-width: 767px)" srcSet={window.investingHeroMediumBackground} />
          <source className='investing-background' srcSet={window.investingHeroDefaultBackground} />
          <img className='investing-background' src={window.investingHeroMediumBackground} alt="Investing background" />
        </picture>
        <div className='investing-text'>
          <div className='investing-container'>
            <div className='investing-headline'>Investing</div>
            <div className='investing-catchphrase'>Build your portfolio starting with just $1</div>
            <div className='investing-separator' ></div>
            <div className='investing-description'>Invest in stocks, ETFs, and their options, at your pace and commission-free.</div>
            <div className='investing-separator' ></div>
            <div className='investing-disclosures'>Investing Disclosures</div>
            <div className='investing-medium-separator' ></div>
            <Link className='stockflow-button investing-button' to='/invest'>Learn More</Link>
            <div className='investing-xl-separator' ></div>
            <div className='investing-disclaimer'>Stocks & funds offered through Stockflow Financial. Other fees may apply. See our Fee Schedule for more details.</div>
          </div>
        </div>
      </div>
      <div className='crypto-section'>
        <picture className='crypto-background'>
          <source className='crypto-background' media="(min-width: 1280px)" srcSet={window.cryptoHeroLargeBackground} />
          <source className='crypto-background' media="(max-width: 425px)" srcSet={window.cryptoHeroSmallBackground} />
          <source className='crypto-background' media="(max-width: 767px)" srcSet={window.cryptoHeroMediumBackground} />
          <source className='crypto-background' srcSet={window.cryptoHeroDefaultBackground} />
          <img className='crypto-background' src={window.cryptoHeroMediumBackground} alt="crypto background" />
        </picture>
        <div className='crypto-text'>
          <div className='crypto-container'>
            <img className="crypto-logo" src={window.stockflowCryptoLogo} />
            <div className='crypto-catchphrase'>Get started with Stockflow Crypto. Trade crypto 24/7</div>
            <div className='crypto-separator' ></div>
            <div className='crypto-description'>Start with as little as $1. Buy, sell, and transfer BTC, ETH, XRP, SOL, DOGE, SHIB, and more.</div>
            <div className='crypto-separator' ></div>
            <div className='crypto-disclosures'>Crypto Risk Disclosures</div>
            <div className='crypto-medium-separator' ></div>
            <Link className='stockflow-button crypto-button' to='/crypto'>Learn More</Link>
            <div className='crypto-xl-separator' ></div>
            <div className='crypto-disclaimer'>Crypto offered through Robinhood Crypto.</div>
          </div>
        </div>
      </div>
      <div className='protection-section'>

      </div>
    </div>
  )
};

export default Splash;
