import React from 'react';

class FundInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  isError(field) {
    return this.props.errors[field] ? true : false
  }
  render() {
    if (this.props.currentForm !== "FundInfo") return null; 
    return (
      <>
        <h1 className="signup-header">How much funds would you like to start off with?<br />
        Remember to only invest spare money!</h1>
        <div className="second-form-group">
          <div className="funds">
            <div className={`error-msg-${this.isError('funds')}`}>{this.props.errors.funds}</div>
            <input type="text" required className={`error-${this.isError('funds')}`} onChange={this.props.handleChange('funds')} placeholder="Funds" value={this.props.state.funds}/>
          </div>
        </div>
      </>
    )
  }
};

export default FundInfo;