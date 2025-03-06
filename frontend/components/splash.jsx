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

    </div>
  )
};

export default Splash;
