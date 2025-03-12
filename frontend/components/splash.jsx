import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from './carousel';

const Splash = () => {
  const protectionBlocks = [
    <div className='protection-block'>
      <picture className='protection-block-image'>
        <source srcSet={window.protectionSectionCube} />
        <img alt='We work hard to keep your data safe and secure.' src={window.protectionSectionCube} />
      </picture>
      <div className='protection-block-text'>We work hard to keep your data safe and secure.</div>
    </div>,
    <div className='protection-block'>
      <picture className='protection-block-image'>
        <source srcSet={window.protectionSectionLayerCircle} />
        <img alt='We protect your account from unauthorized activity.' src={window.protectionSectionLayerCircle} />
      </picture>
      <div className='protection-block-text'>We protect your account from unauthorized activity.</div>
    </div>,
    <div className='protection-block'>
      <picture className='protection-block-image'>
        <source srcSet={window.protectionSectionSecureCircle} />
        <img alt='We provide multi-factor authentication on all accounts.' src={window.protectionSectionSecureCircle} />
      </picture>
      <div className='protection-block-text'>We provide multi-factor authentication on all accounts.</div>
    </div>,
    <div className='protection-block'>
      <picture className='protection-block-image'>
        <source srcSet={window.protectionSectionChat} />
        <img alt="We've got your back. We're available to you 24/7." src={window.protectionSectionChat} />
      </picture>
      <div className='protection-block-text'>We've got your back. We're available to you 24/7.</div>
    </div>
  ]

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
            <div className='retirement-headline'>Progress is gold. Get an IRA boost.</div>
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
            <div className='stockflow-gold-info'>With Stockflow Gold, get a 3% IRA boost of up to $420 when you max out your 2024 contributions by April 15th—and stack on your max contributions for 2025. Non-Gold? Enjoy a 1% match.</div>
            <div className='retirement-text-separator'></div>
            <div className='stockflow-gold-info'>You can also transfer any IRA or old 401(k) by April 30th for unlimited 2% match potential.</div>
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
            <div className='crypto-separator'></div>
            <div className='crypto-description'>Start with as little as $1. Buy, sell, and transfer BTC, ETH, XRP, SOL, DOGE, SHIB, and more.</div>
            <div className='crypto-separator'></div>
            <div className='crypto-disclosures'>Crypto Risk Disclosures</div>
            <div className='crypto-medium-separator' ></div>
            <Link className='stockflow-button crypto-button' to='/crypto'>Learn More</Link>
            <div className='crypto-xl-separator'></div>
            <div className='crypto-disclaimer'>Crypto offered through Stockflow Crypto.</div>
          </div>
        </div>
      </div>
      <div className='protection-section'>
        <div className='protection-header-container'>
          <div className='protection-title'>Stockflow Protection Guarantee</div>
          <Link className='stockflow-button protection-button'>Learn more about our committments</Link>
        </div>
        <div className='protection-block-section wide'>
          {...protectionBlocks}
        </div>
        <div className='protection-block-section mobile'>
          <Carousel slides={protectionBlocks} />
        </div>
      </div>
      <div className='stockflow-learn-section'>
        <div className='stockflow-learn-content-container'>
          <div className='stockflow-learn-small-separator'></div>
          <div className='stockflow-learn-headline'>Become a better investor on the go, right in the app</div>
          <div className='stockflow-learn-small-separator'></div>
          <div className='stockflow-learn-catchphrase'>Here's a preview of the things you can learn when you sign up.</div>
          <div className='stockflow-learn-medium-separator'></div>
          <Link className='stockflow-button stockflow-learn-button' to='/signup'>Sign up to Access Stockflow Learn</Link>
          <div className='stockflow-learn-large-separator'></div>
          <picture className='stockflow-learn-phone-image'>
            <source className='stockflow-learn-phone-image' media='(max-width: 425px)' srcSet={window.stockflowLearnPhoneSmall}/>
            <source className='stockflow-learn-phone-image' srcSet={window.stockflowLearnPhoneDefault}/>
            <img className='stockflow-learn-phone-image' alt='Learn On Phone' src={window.stockflowLearnPhoneDefault}/>
          </picture>
        </div>
      </div>
      <div className='new-gen-section'>
        <video className='new-gen-background' autoPlay loop muted playsInline preload="auto">
          <source src={window.stockflowNewGenInvestorsBackground} type="video/webm" />
        </video>
        <div className='new-gen-text'>
          <div className='new-gen-text-container'>
            <div className='new-gen-headline'>Join a new generation of investors</div>
            <div className='new-gen-text-separator'></div>
            <Link to="/signup" className="stockflow-button new-gen-signup-button">Sign up</Link>
          </div>
        </div>
      </div>
    </div >
  )
};

export default Splash;
