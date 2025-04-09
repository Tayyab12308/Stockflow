import React from "react";
import { LoginCheckboxProps } from "./login.interfaces";

const LoginCheckbox: React.FC<LoginCheckboxProps> = ({
  checked,
  onChange
}: LoginCheckboxProps): React.JSX.Element => (
  <label className="remember-checkbox-container">
    <div className="checkbox-label-text">Keep me logged in for up to 30 days</div>
    <input className="login-checkbox-input" type="checkbox" checked={checked} onChange={onChange} />
  </label>
);


export default LoginCheckbox;
