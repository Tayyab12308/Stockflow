import React from "react";
import { LoginInputProps } from "./login.interfaces";

const LoginInput: React.FC<LoginInputProps> = ({
  label,
  type,
  value,
  onChange,
  error,
}: LoginInputProps) => (
  <label>
    <div className="input-label">
      {label} {error && <div className="session-error">{error}</div>}
    </div>
    <input className="login-input" type={type} value={value} onChange={onChange} required />
  </label>
);


export default LoginInput;
