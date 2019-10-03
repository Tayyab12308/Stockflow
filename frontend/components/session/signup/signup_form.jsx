import React from 'react';
import AccountInfo from './account_info';
import BasicInfo from './basic_info';
import FundInfo from './fund_info';

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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._continue = this._continue.bind(this);
  }

  handleChange(field) {
    return e => this.setState({ [field]: e.target.value })
  }

  handleSubmit(e) {
    // debugger
    e.preventDefault();
    this.props.signup(this.state);
  }

  _continue() {
    let currForm = this.state.currentForm;
    if (this.props.errors.length === 0) {
      if (this.state.currentForm === "AccountInfo") {
        currForm = "BasicInfo"
      } else if (this.state.currentForm === "BasicInfo") {
        currForm = "FundInfo"
      } 
      this.setState({ currentForm: currForm })
    }
  }

  continueButton() {
    if (this.state.currentForm !== "FundInfo") {
      return (
        <button onClick={this._continue}>Continue</button>
      )
    }
    return null;
  }

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit} className="signup-form">
          <AccountInfo handleChange={this.handleChange} state={this.state} currentForm={this.state.currentForm}/>
          <BasicInfo handleChange={this.handleChange} state={this.state} currentForm={this.state.currentForm}/>
          <FundInfo handleChange={this.handleChange} state={this.state} currentForm={this.state.currentForm}/>
          {this.continueButton()}
        </form>
      </>
    )
  }
};

export default SignupForm;