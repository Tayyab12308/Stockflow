import React from 'react';

const FundInfo = props => {
  // debugger
  if (props.currentForm !== "FundInfo") return null; 
  return (
    <>
      <h1>How much funds would you like to start off with</h1>
      <p>Remember to only invest spare money</p>
      <div className="form-group">
        <input type="text" required onChange={props.handleChange('funds')} value={props.state.funds}/>
        <button type="submit" value="Sign Up">Sign Up</button>
      </div>
    </>
  )
};

export default FundInfo;