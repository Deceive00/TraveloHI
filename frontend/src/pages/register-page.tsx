import TextField from "../components/form/Textfield";
import { useForm } from 'react-hook-form';
import '../style/register-page.scss'
import logo from "../assets/travelohiLogo.png";
import SecurityQuestions from "../components/form/SecurityDropDown";
import { useState } from "react";
import axios from "axios";
import ProfilePicture from "../components/form/ProfilePicture";
import { uploadImage } from "../utils/utils";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage(){
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch} = useForm();
  const watchPassword = watch('password', '');
  const [subscribe, setSubscribe] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([]);

  const handleChangeSecurity = (value: any) => {

    setSecurityQuestions(value);
  };


  const onSubmit = async (data : any) => {
    try {
      if(securityQuestions.length <= 0){
        alert('Please add at least 1 security questions')
        return;
      }
      const ext = data.profilePicture.name.split('.')[1]
      const emailValue = data.email;
      const filename = `profilepicture/${emailValue}_profilepicture.${ext}`;

      const downloadURL = await uploadImage(filename, data.profilePicture);
      
      const { profilePicture: profilePicture, ...pureData } = data;
      const stringifiedData = JSON.stringify({ 
        ...pureData,
        profilePicture: downloadURL,
        isSubscribe: subscribe,
        securityQuestions 
      });
      const response = await axios.post('http://localhost:8080/api/register', stringifiedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Registration successful');
        alert('Registration Succesful')
        navigate('/login');
      } else {
        console.error('Registration failed: ', response.statusText);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  const currentDate = new Date();

  const rules = {
    'name' : {
      required: 'required*',
      minLength: { value: 5, message: 'Name must be at least 5 characters.' },
      pattern: { value: /^[A-Za-z]+$/, message: 'Name must contain only letters.' },
    },
    email: {
      required: 'required*',
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: 'Invalid email format. Example: hans.indrawan@gmail.com',
      },
    },
    dob: {
      required: 'required*',
      validate: (value: string) => {
        const dob = new Date(value);
        
        if (isNaN(dob.getTime())) {
          return 'Invalid date format.';
        }

        const age = currentDate.getFullYear() - dob.getFullYear();

        if (age < 13) {
          return 'You must be at least 13 years old.';
        }

        return true;
      },
    },
    gender: {
      required: 'Please select your gender.',
    },
    password: {
      required: 'required*',
      minLength: { value: 8, message: 'Password must be at least 8 characters.' },
      validate: (value : any) => {
        const requirementsRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?[\]\\|]).*$/;

        if (requirementsRegex.test(value)) {
          return true;
        }

        return 'Password must include capital letters, lowercase letters, numbers, and special symbols.';
      },
    },
    profilePicture:{

    }
  } 

  const passwordRequirements = [
    'At least one lowercase letter',
    'At least one uppercase letter',
    'At least one digit (number)',
    'At least one special character',
    'Total length must be between 8 and 30 characters',
  ];

  const checkRequirementFulfilled = (password : any, requirement : any) => {
    switch (requirement) {
      case 'At least one lowercase letter':
        return /[a-z]/.test(password);
      case 'At least one uppercase letter':
        return /[A-Z]/.test(password);
      case 'At least one digit (number)':
        return /\d/.test(password);
      case 'At least one special character':
        return /[!@#$%^&*()-_=+{};:,<.>/?[\\]\\|]/.test(password);
      case 'Total length must be between 8 and 30 characters':
        return password.length >= 8 && password.length <= 30;
      default:
        return false;
    }
  };
  
  return (
    <div>
      <div className="form-body">
        <div className="register-form-container " >

          <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-title">
              <img src={logo} alt="logo.png" className="imported-logo" />
              <div className="form-title-container">
                <h1>Sign Up</h1>
                <p>Explore this world with traveloHI</p>
              </div>
            </div>
            <ProfilePicture label={'profilePicture'} error={errors.profilePicture} rules={rules.profilePicture} register={register}/>
            <div className="name-container">
              <div className="first-name-container">
                <TextField
                  label="First Name"
                  name="firstName"
                  type="text"
                  register={register}
                  rules={rules.name}
                  error={errors.firstName}
                />
              </div>
              <div className="last-name-container">
                <TextField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  register={register}
                  rules={rules.name}
                  error={errors.lastName}
                />
              </div>
            </div>
            <div>
              <TextField
                label="Email"
                name="email"
                type="email"
                register={register}
                rules={rules.email}
                error={errors.email}
              />
            </div>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              register={register}
              rules={rules.dob}
              error={errors.dob}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              register={register}
              rules={rules.password}
              error={errors.password}
            />
            <div className={`password-requirements`}>
              <h4>Password Requirements:</h4>
              <ol>
                {passwordRequirements.map((requirement, index) => (
                  <li key={index} className={checkRequirementFulfilled(watchPassword, requirement) ? 'valid' : ''}>
                    {requirement}
                  </li>
                ))}
              </ol>
            </div>
            <TextField
              label="Confirmation Password"
              name="confirmationPassword"
              type="password"
              register={register}
              rules={rules.password}
              error={errors.confirmationPassword}
            />
            <div className="gender-container">
              <label className="form-control">
                <input type="radio"  {...register("gender", rules.gender)} value={'Male'}/>
                Male
              </label>

              <label className="form-control">
                <input type="radio" {...register("gender", rules.gender)} value={'Female'}/>
                Female
              </label>
            </div>
            <SecurityQuestions
              handleChange={handleChangeSecurity}
            />
            <label htmlFor="subscribe" className="form-control">
              <input 
                type="checkbox" 
                name="subscribe" 
                id="subscribe"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
              />
              I want to hear traveloHI newsletter and promotion
            </label>
            <button type="submit" className="submit-button register">Sign Up</button>
          </form>
          <p className="sign-up-info">
            Already have an account?
            <Link className="sign-up-link" to={"/login"}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}