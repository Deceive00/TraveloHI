import TextField from "../components/form/Textfield";
import { useForm } from 'react-hook-form';
import '../style/register-page.scss'
import logo from "../assets/travelohiLogo.png";
import SecurityQuestions from "../components/form/SecurityDropDown";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import ProfilePicture from "../components/form/ProfilePicture";
import { rules, uploadImage } from "../utils/utils";
import { Link, useNavigate } from "react-router-dom";
import defaultPP from '../image/default.png'
import ReCAPTCHA from "react-google-recaptcha"
import Snackbar from "../components/form/Snackbar";
export default function RegisterPage(){
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch} = useForm();
  const watchPassword = watch('password', '');
  const [subscribe, setSubscribe] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [fillRecaptcha, setFillRecaptcha] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState('error')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const handleRecaptcha = () => {
    setFillRecaptcha(true);
  }
  const handleChangeSecurity = (value: any) => {

    setSecurityQuestions(value);
  };


  const onSubmit = async (data : any) => {

    try {
      if(!fillRecaptcha){
        setSnackbarOpen(true);
        setSnackbarMessage('Please verify yourself with recaptcha!');
        setSnackbarType('error');
        return;
      }
      if(securityQuestions.length <= 0){
        alert('Please add at least 1 security questions')
        setSnackbarOpen(true);
        setSnackbarMessage('Please add at least 1 security questions!');
        setSnackbarType('error');
        return;
      }

      let downloadURL;
      if (data.profilePicture) {
        const ext = data.profilePicture.name.split(".")[1];
        console.log(data.profilePicture.name);
        const emailValue = data.email;
        const filename = `profilepicture/${emailValue}_profilepicture.${ext}`;

        downloadURL = await uploadImage(filename, data.profilePicture);
      } else {
        downloadURL = "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/profilepicture%2Fdefault.png?alt=media&token=27dc51d0-2377-4bdb-90e1-272d1067203f";
      }

      
      const { profilePicture: profilePicture, ...pureData } = data;
      const stringifiedData = JSON.stringify({ 
        ...pureData,
        profilePicture: downloadURL,
        isSubscribe: subscribe,
        securityQuestions 
      });

      console.log(stringifiedData)
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
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        if (typeof responseData === 'object' && responseData !== null && 'error' in responseData) {
            console.error('Registration Failed:', responseData.error);
            setSnackbarMessage(responseData.error as string);
        }
        setSnackbarType('error');
        setSnackbarOpen(true);
      }
    }
  };

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
            <ProfilePicture label={'profilePicture'} error={errors.profilePicture} rules={rules.profilePicture} register={register} className="register-picture" currentImg={defaultPP}/>
            <div className="name-container" style={{marginTop:'2vh'}}>
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
            <ReCAPTCHA
              sitekey="6Leu1FkpAAAAANqqSbxD4IZhMTHvEPPvuHWzRBCU"
              onChange={handleRecaptcha}
              style={{marginTop:'1.5vh'}}
            />
            <button type="submit" className="submit-button register">Sign Up</button>
          </form>
          <p className="sign-up-info">
            Already have an account?
            <Link className="sign-up-link" to={"/login"}>Login here</Link>
          </p>
        </div>
      </div>
      <Snackbar message={snackbarMessage} type={snackbarType} show={snackbarOpen} setShow={setSnackbarOpen}/>
    </div>
  );
}