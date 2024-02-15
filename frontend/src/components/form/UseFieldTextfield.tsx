import { useState } from "react";
import "../../style/form.scss";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const UseFieldTextfield = ({
  label,
  name,
  type,
  register,
  rules,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  register: any;
  rules: any;
  error: any;
  defaultValue?: string;
}) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        defaultValue={defaultValue || ""}
        {...register}
        className={`form-input ${error ? "error" : ""}`}
        placeholder={label}
      />
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default UseFieldTextfield;
