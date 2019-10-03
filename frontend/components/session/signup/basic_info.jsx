import React from 'react';

const BasicInfo = props => {
  // debugger
  if (props.currentForm !== "BasicInfo") return null;
  return (
    <>
      <h2>Welcome {props.email_address},</h2>
      <h3>Enter Your Contact Information</h3>
      <div className="form-group">
        <input type="text" required onChange={props.handleChange('address')} value={props.state.address}/>
        <input type="text" required onChange={props.handleChange('phone_number')} value={props.state.phone_number}/>
      </div>
    </>
  )
};

export default BasicInfo;