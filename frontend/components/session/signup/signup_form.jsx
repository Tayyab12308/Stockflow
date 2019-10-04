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
      errors: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._continue = this._continue.bind(this);
  }

  handleChange(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.signup(this.state).then(() => this.props.history.push("/"));
  }

  _continue(e) {
    e.preventDefault();
    let errors = this.validFormFields();
    this.setState({ errors }, () => {
      if (this.state.errors.length === 0) {
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
    };
    this.setState({ currentForm: currForm });
  }

  validFormFields() {
    let errorsArr = [];
    const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (this.state.currentForm === 'AccountInfo') {
      this.state.first_name.length > 1 ? null : errorsArr.push("First name can't be blank");
      this.state.last_name.length > 1 ? null : errorsArr.push("Last name can't be blank");
      regEmail.test(this.state.email_address) ? null : errorsArr.push("Email address can't be blank");
      this.state.password.length < 6 ? errorsArr.push("Password is too short"): null;
    } else if (this.state.currentForm === 'BasicInfo') {
      this.state.address.length < 1 ? errorsArr.push("Address is too short"): null;
      regPhone.test(this.state.phone_number) ? null : errorsArr.push("Phone number is invalid");
    }
    return errorsArr;
  }

  renderErrors() {
    if (this.state.errors.length > 0) {
      return (
        <ul>
          {this.state.errors.map((error, idx) => (
            <li key={`errr-${idx}`}>{error}</li>
          ))}
        </ul>
      )
    }
  }


  continueButton() {
    this.props.clearErrors();
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
      {this.renderErrors()}
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