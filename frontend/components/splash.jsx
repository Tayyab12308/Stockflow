import React from 'react';
import { Link } from 'react-router-dom';

class Splash extends React.Component {
  render() {
    return (
      <>
        <div className="first-group">
          <div className="intro-text">
            <h1 className="first-header">Invest <br /> Commission-Free</h1>
            <p className="first-body">
              Invest in <a href="#">stocks</a>, <a href="#">ETFs</a>, options and <br /> <a href="#">cryptocurrencies</a>, all
               commission-free, <br />
              right from your phone or desktop.
              <br/>
            </p>
              <Link className="signup-button" to="/signup">Sign up</Link>
          </div>
          <div className="image-container">
            <img className="first-image" src={window.homePageGif} />
          </div>
        </div>
        <div className="second-image-container">
          <img className="second-image" src={window.rocketKitty}/>
        </div>
        <div className="second-group">
          <div className="group-stock">
            <div className="stock-image">
              <img className="group-image"src={window.stockGraph}/>
            </div>
            <div className="group-text">
              <h3 className="group-headers">Stocks</h3>
              <p className="group-body">
                Invest in companies you love <br />
                and build out your perfect <br />
                portfolio <br />
              </p>
              <Link className="outer-links" to="#">Learn about stocks</Link>
            </div>
          </div>
          <div className="group-etfs">
            <div className="etf-image">
              <img className="group-image"src={window.etfs} />
            </div>
            <div className="group-text">
              <h3 className="group-headers">ETFs</h3>
              <p className="group-body">
                Diversify your holdings by <br />
                buying into a bundle of stocks <br />
                in a single investment <br />
              </p>
              <Link className="outer-links" to="#">Learn about ETFs</Link>
            </div>
          </div>
          <div className="group-options">
            <div className="options-image">
              <img className="group-image"src={window.stockOptions} />
            </div>
            <div className="group-text">
              <h3 className="group-headers">Options</h3>
              <p className="group-body">
                Choose to go long on stocks <br/>
                you believe in and short the <br/>
                ones you don't <br/>
              </p>
              <Link className="outer-links" to="#">Learn about options</Link>
            </div>
          </div>
          <div className="group-crypto">
            <div className="crypto-image">
              <img className="group-image"src={window.cryptoCurr} />
            </div>
            <div className="group-text">
              <h3 className="group-headers">Crypto</h3>
              <p className="group-body">
                Tap into the cryptocurrency <br/>
                market to trade <Link to="#">Bitcoin, </Link> <br/>
                <Link to="#">Ethereum, </Link> and <Link to="#">More</Link>, 24/7 
              </p>
              <Link className="outer-links" to="#">Learn about crypto</Link>
            </div>
          </div>
        </div>
        <div className="third-group">
          <div className="third-image-container">
            <img className="third-image" src={window.singlePhone}/>
          </div>
          <div className="intro-text third-content">
            <h1 className="third-header">No Manual Needed</h1>
            <p className="third-body">
              Intuitively designed for newcomers and experts alike, <br/>
              Stockflow gives you a clear picture of your portfolio's <br/>
              performance over time, so you can adjust your positions <br/>
              and learn by doing. 
            </p>
          </div>
        </div>
        <div className="fourth-group">
          <div className="fourth-image-container">
            <img className="fourth-image" src={window.darkMultiPhone}/>
          </div>
          <div className="fourth-text">
            <h1 className="fourth-header">Next Level Investing</h1>
            <p className="fourth-body">
              Access professional research reports, trade on margin, and <br/>
              make bigger instant deposits with Stockflow Gold -all starting <br/>
              at $5 a month.
            </p>
            <button className="gold-button">Learn More</button>
          </div>
        </div>
        <div className="fifth-group">
          <div className="fifth-text">
            <h1 className="fifth-header">Keep Tabs on the <br/> Market</h1>
            <p className="fifth-body">
              Access tools and features such as price movement <br/>
              notifications and customized investment news so you <br/>
              can find the right moment to invest.
            </p>
          </div>
          <div className="fifth-image-container">
            <img className="fifth-image" src={window.browsingPhone} />
          </div>
        </div>
        <div className="sixth-group">
          <div className="sixth-image-container">
            <img className="sixth-image" src={window.eagleLogo} />
          </div>
          <div className="sixth-text">
            <h1 className="sixth-header">Trusted by Millions <br/> in the USA</h1>
            <p className="sixth-body">
              Stockflow protects securities of it customers for <br/>
              up to $500,000(including $250,000 for claims for cash). <br/>
              Explanatory brochure available upon request.
            </p>
          </div>
        </div>
        <div className="seventh-group">
          <h1 className="seventh-header">Get Started</h1>
          <p className="seventh-body">
            It only takes a few minutes to take control of your financial future. Sign up now to <br/>
            start investing with Stockflow
          </p>
          <Link to="/signup" className="inverted-signup">Sign Up</Link>
        </div>
      </>
    )
  }
};

export default Splash;