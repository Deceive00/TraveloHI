import { useState } from 'react';
import '../../style/form.scss'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const TextField = ({ label, name, type, register, rules, error } :{label:any, name:any, type:any, register:any,rules:any, error:any}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if(type === "password"){
    return (
      <div className="input-group">
        <label htmlFor={name}>{label}</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : type}
            id={name}
            name={name}
            {...register(name, rules)}
            className={`form-input ${error ? 'error' : ''}`}
            placeholder={label}
          />
          {type === 'password' && (
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {!showPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          )}
        </div>
        {error && <div className="error-message">{error.message}</div>}
      </div>
    );
  }
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        
        {...register(name, rules)}
        className={`form-input ${error ? "error" : ""}`}
        placeholder={label}
      />
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default TextField;
