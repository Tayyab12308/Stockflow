import React from 'react';
import AccountInfo from './account_info';
import BasicInfo from './basic_info';
import FundInfo from './fund_info';
import SubmitInfo from './submit_info';
import ProgressBar from '../../progressbar/progress_bar';
import { Link } from 'react-router-dom';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: "AccountInfo",
      first_name: "",
      last_name: "",
      email_address: "",
      password: "",
      address: "",
      phone_number: "",
      funds: "",
      errors: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._continue = this._continue.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  handleChange(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const userParams = { ...this.state, portfolio_value: this.state.funds };
    this.props.signup(userParams).then(() => this.props.history.push("/dashboard"));
  }

  _continue(e) {
    e.preventDefault();
    let errors = this.validFormFields();
    this.setState({ errors }, () => {
      if (this.anyErrors()) {
        this.assignNextForm();
      } else {
        this.renderErrors();
      };
    });
  }
    
  assignNextForm() {
    let currForm = this.state.currentForm;
    if (this.state.currentForm === "AccountInfo") {
      currForm = "BasicInfo";
    } else if (this.state.currentForm === "BasicInfo") {
      currForm = "FundInfo";
    } else if (this.state.currentForm === "FundInfo") {
      currForm = "SubmitInfo"
    };
    this.setState({ currentForm: currForm });
  }

  validFormFields() {
    let allErrors = {
      first_name: null,
      last_name: null,
      email_address: null,
      password: null,
      address: null,
      phone_number: null,
      funds: null
    };
    const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const regPrice = /(\d+\.\d{1,2})/;
    if (this.state.currentForm === 'AccountInfo') {
      this.state.first_name.length > 1 ? null : allErrors["first_name"] = "First name can't be blank";
      this.state.last_name.length > 1 ? null : allErrors["last_name"] = "Last name can't be blank";
      regEmail.test(this.state.email_address) ? null : allErrors["email_address"] = "Email address is invalid";
      this.state.password.length < 6 ? allErrors["password"] = "Password is too short" : null;
    } else if (this.state.currentForm === 'BasicInfo') {
      this.state.address.length < 1 ? allErrors["address"] = "Address can't be blank" : null;
      regPhone.test(this.state.phone_number) ? null : allErrors["phone_number"] = "Phone number is invalid";
    } else if (this.state.currentForm === "FundInfo") {
      regPrice.test(this.state.funds) ? null : allErrors["funds"] = "Funds must be all numbers"
    };
    return allErrors;
  }

  anyErrors() {
    let errors = this.validFormFields();
    let errorsArr = Object.values(errors);
    return errorsArr.every(el => el === null)
  }

  renderErrors() {
    let errors = Object.values(this.validFormFields());
    return (
      <ul>
        {errors.map((error, idx) => (
          <li key={`errr-${idx}`}>{error}</li>
        ))}
      </ul>
    )
  }


  continueButton() {
    this.props.clearErrors();
    if (this.state.currentForm !== "SubmitInfo") {
      return (
        <button className="continue-button" onClick={this._continue}>Continue</button>
      )
    }
    return null;
  }

  handleRange() {
    switch (this.state.currentForm) {
      case "AccountInfo":
        return 1;
      case "BasicInfo":
        return 2;
      case "FundInfo":
        return 3;
      case "SubmitInfo":
        return 4;
      default:
        return 0;
    }
  }

  handlePrevious(value) {
    this.setState({ currentForm: value });
  }

  setPercentage() {
    let percentage = 0;
    if (this.state.currentForm === "AccountInfo") {
      percentage = 8;
    } else if (this.state.currentForm === "BasicInfo") {
      percentage = 35;
    } else if (this.state.currentForm === "FundInfo") {
      percentage = 62;
    } else if (this.state.currentForm === "SubmitInfo") {
      percentage = 100;
    }
    return percentage;
  }


  render() {
    const accountInfoErrors = (({ first_name, last_name, email_address, password }) => ({ first_name, last_name, email_address, password }))(this.state.errors);
    const basicInfoErrors = (({ address, phone_number }) => ({ address, phone_number }))(this.state.errors);
    const fundInfoErrors = (({ funds }) => ({ funds }))(this.state.errors);
    const percent = this.setPercentage();
    return (
      <>
      <header>
        <div className="navbar navbar-container">
          <div className="navbar-logo">
              <Link to="/"><img className="logo-image" src={window.stockflowLogo} /></Link>
          </div>
          <div className="signup-nav">  
            <div className="progress-items">
              <p className={`active-${percent === 8 ? true : false}`}>Account</p>
              <p className={`active-${percent === 35 ? true : false}`}>Basic Info</p>
              <p className={`active-${percent === 62 ? true : false}`}>Funding</p>
              <p className={`active-${percent === 100 ? true : false}`}>Submit</p>
            </div>
            <div className="status-bar">
              <ProgressBar percentage={percent}/>
            </div>
          </div>
        </div>
      </header>
        <form onSubmit={this.handleSubmit} className="signup-form">
          <AccountInfo errors={accountInfoErrors} handleChange={this.handleChange} state={this.state} currentForm={this.state.currentForm}/>
          <BasicInfo errors={basicInfoErrors} handleChange={this.handleChange} state={this.state} currentForm={this.state.currentForm}/>
          <FundInfo errors={fundInfoErrors} handleChange={this.handleChange} state={this.state} currentForm={this.state.currentForm}/>
          <SubmitInfo state={this.state} currentForm={this.state.currentForm} handlePrevious={this.handlePrevious}/>
          {this.continueButton()}
        </form>
      </>
    )
  }
};

export default SignupForm;