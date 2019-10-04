import React from 'react';

const AccountInfo = props => {
  // debugger
  if (props.currentForm !== "AccountInfo") return null;
  return (
    <>
      <h2 className="signup-header">Make Your Money Move</h2>
      <h3 className="signup-sub-header">Stockflow lets you invest in companies you love, commission-free</h3>
        <div className="form-group">
          <div className="name">
            <input type="text" required placeholder="First Name" onChange={props.handleChange('first_name')} value={props.state.first_name} />
          <input type="text" required placeholder="Last Name" onChange={props.handleChange('last_name')} value={props.state.last_name} />
          </div>
        <input type="email" required placeholder="Email Address" onChange={props.handleChange('email_address')} value={props.state.email_address} />
        <input type="password" required placeholder="Password(min. 6 characters)" onChange={props.handleChange('password')} value={props.state.password} />
        </div>
    </>
  )
};

export default AccountInfo;