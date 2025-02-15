import React, { useCallback, useState } from 'react';
import AccountInfo from './account_info';
import BasicInfo from './basic_info';
import FundInfo from './fund_info';
import SubmitInfo from './submit_info';
import ProgressBar from '../../progressbar/progress_bar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearSessionErrors, signup } from '../../../actions/session_actions';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionErrors = useSelector(state => state.errors.session);

  const clearErrors = () => dispatch(clearSessionErrors());
  const signupUser = (user) => dispatch(signup(user));

  const [formState, setFormState] = useState({
    currentForm: "AccountInfo",
    first_name: "",
    last_name: "",
    email_address: "",
    password: "",
    address: "",
    phone_number: "",
    funds: "",
    errors: {},
  });

  const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const regPrice = /(\d+\.\d{1,2})/;


  const handleChange = (field) => (e) => setFormState(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const userParams = { ...formState, portfolio_value: formState.funds };
    signupUser(userParams).then(() => navigate("/dashboard"));
  }

  const _continue = (e) => {
    e.preventDefault();
    const errors = validFormFields();
    setFormState(prev => ({ ...prev, errors }));
    if (anyErrors()) {
      assignNextForm();
    } else {
      renderErrors();
    };
  };

  const assignNextForm = useCallback(() => {
    let form;
    if (formState.currentForm === "AccountInfo") {
      form = "BasicInfo";
    } else if (formState.currentForm === "BasicInfo") {
      form = "FundInfo";
    } else if (formState.currentForm === "FundInfo") {
      form = "SubmitInfo"
    };
    setFormState(prev => ({ ...prev, currentForm: form }));
  }, [formState.currentForm])

  const validFormFields = useCallback(() => {
    const allErrors = {
      first_name: null,
      last_name: null,
      email_address: null,
      password: null,
      address: null,
      phone_number: null,
      funds: null
    };

    if (formState.currentForm === 'AccountInfo') {
      allErrors["first_name"] = formState.first_name.length > 0 ? null : "First name can't be blank";
      allErrors["last_name"] = formState.last_name.length > 0 ? null : "Last name can't be blank";
      allErrors["email_address"] = regEmail.test(formState.email_address) ? null : "Email address is invalid";
      allErrors["password"] = formState.password.length < 6 ? "Password is too short" : null;
    } else if (formState.currentForm === 'BasicInfo') {
      allErrors["address"] = formState.address.length < 1 ? "Address can't be blank" : null;
      allErrors["phone_number"] = regPhone.test(formState.phone_number) ? null : "Phone number is invalid";
    } else if (formState.currentForm === "FundInfo") {
      allErrors["funds"] = regPrice.test(formState.funds) ? null : "Funds must be all numbers"
    };
    return allErrors;
  }, [formState, regEmail, regPhone, regPrice]);

  const anyErrors = useCallback(() => {
    return Object.values(validFormFields()).every(el => el === null);
  }, [validFormFields]);

  const renderErrors = () => (
    <ul>
      {Object.values(validFormFields()).map((error, idx) => (
        <li key={`errr-${idx}`}>{error}</li>
      ))}
    </ul>
  )

  const continueButton = () => {
    clearErrors();
    if (formState.currentForm !== "SubmitInfo") {
      return (
        <button className="continue-button" onClick={_continue}>Continue</button>
      )
    }
    return null;
  }

  const handleRange = () => {
    switch (formState.currentForm) {
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

  const handlePrevious = (value) => setFormState(prev => ({ ...prev, currentForm: value }));

  const setPercentage = () => {
    let percentage = 0;
    if (formState.currentForm === "AccountInfo") {
      percentage = 8;
    } else if (formState.currentForm === "BasicInfo") {
      percentage = 35;
    } else if (formState.currentForm === "FundInfo") {
      percentage = 62;
    } else if (formState.currentForm === "SubmitInfo") {
      percentage = 100;
    }
    return percentage;
  }

  const percent = setPercentage();

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
              <ProgressBar percentage={percent} />
            </div>
          </div>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="signup-form">
        <AccountInfo errors={formState.errors} handleChange={handleChange} state={formState} currentForm={formState.currentForm} />
        <BasicInfo errors={formState.errors} handleChange={handleChange} state={formState} currentForm={formState.currentForm} />
        <FundInfo errors={formState.errors} handleChange={handleChange} state={formState} currentForm={formState.currentForm} />
        <SubmitInfo state={formState} currentForm={formState.currentForm} handlePrevious={handlePrevious} />
        {continueButton()}
      </form>
    </>
  )
};

export default SignupForm;