import logo from "../assets/travelohiLogo.png";
import "../style/login-page.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from "react";
import Snackbar from "../components/form/Snackbar";
import LoginOTP from "../components/auth/LoginOTP";
import { useUser } from "../context/UserContext";
import ForgotPassword from "../components/auth/ForgotPassword";
import BackButton from "../components/form/BackButton";

export default function LoginPage() {
  const { refetch } = useUser();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }} = useForm();
  const [fillRecaptcha, setFillRecaptcha] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState('error')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [openOTPMenu, setOpenOTPMenu] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
 
  const rules = {
    email: {
      required: 'Please fill this field',
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: 'Invalid email format. Example: hans.indrawan@gmail.com',
      },
    },
    password: {
      required: 'Please fill this field'
    }
  }

  const onSubmit = async (data : any) => {
    try{
      if(!fillRecaptcha){
        setSnackbarOpen(true);
        setSnackbarMessage('Please verify yourself with recaptcha!');
        return;
      }
      const stringifiedData = JSON.stringify(data);
      const response = await axios.post('http://localhost:8080/api/login', stringifiedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
  
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
  
      if(response.status === 200){
        console.log('Login successful');
        await refetch();
        setRedirect(true);    
      }
      else {
        console.error('Login failed: ', response.statusText);
  
      }
    } catch(error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        if (typeof responseData === 'object' && responseData !== null && 'error' in responseData) {
            console.error('Error details:', responseData.error);
            setSnackbarMessage(responseData.error as string);
        }
        setSnackbarType('error');
        setSnackbarOpen(true);
    }
    }
  }

  const handleRecaptcha = () => {
    setFillRecaptcha(true);
  }

  useEffect(() => {
    if (redirect) {
      navigate('/');
    }
  }, [redirect, navigate]);

  return (
    <>
      <div className="form-body-login">
        <div className="login-form-container">
          
          <div className="form-title">
            <img src={logo} alt="logo.png" className="imported-logo" />
            <div className="form-title-container">
              {
                ((!openOTPMenu && !openForgotPassword) || openOTPMenu) && (
                  <>
                    <h1>Let's get started</h1>
                    <p>Welcome back! Please enter your credentials</p>
                  </>
                )
              }
              {
                openForgotPassword && (
                  <>
                    <h1>Reset Password</h1>
                    <p>Please input your email</p>
                  </>
                )
              }
            </div>
          </div>
          {
            
            (!openOTPMenu && !openForgotPassword) && (

              <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-container">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <input type="email" className={`input-field ${errors.email ? "error" : ""}`} placeholder="Email" {...register("email", rules.email)}/>
                </div>
                {errors.email && <div className="error-message">{errors.email.message as string ?? ''}</div>}
                <div style={{marginTop:'0.5rem'}} className="input-container">
                  <FontAwesomeIcon icon={faLock} className="icon" />
                  <input type="password" className={`input-field ${errors.password ? "error" : ""}`} placeholder="Password" {...register("password", rules.password)}/>
                </div>
                {errors.password && <div className="error-message">{errors.password.message as string ?? ''}</div>}
                <ReCAPTCHA
                  sitekey="6Leu1FkpAAAAANqqSbxD4IZhMTHvEPPvuHWzRBCU"
                  onChange={handleRecaptcha}
                  style={{marginTop:'1.5vh'}}
                />
                <p className="forgot-password-link">
                  <span className="forgot-password-label" onClick={() => setOpenForgotPassword(true)}>Forgot Password?</span>
                </p>
                <button type="submit" className="submit-button">Log in</button>
                <div className="divider">
                  <div className="divider-inline"></div>
                  <div className="divider-text">atau login dengan</div>
                  <div className="divider-inline"></div>
                </div>
                <button className="otp-button" onClick={() => setOpenOTPMenu(true)}>Log in with OTP</button>
              </form>
            )
          }
          {
            openOTPMenu && (
              <>
                <BackButton className={'backButton'} onClick={() => setOpenOTPMenu(false)}/>
                <LoginOTP/>
              </>
            )
          }
          {
            openForgotPassword && (
              <>
                <BackButton className={'backButton'} onClick={() => setOpenForgotPassword(false)}/>
                <ForgotPassword closeMenu={() => setOpenForgotPassword(false)}/>
              </>
            )
          }
          <p className="sign-up-info">
            Don't have an account?
            <Link className="sign-up-link" to={"/signup"}>Register here</Link>
          </p>

        </div>

        <Snackbar message={snackbarMessage} type={snackbarType} show={snackbarOpen} setShow={setSnackbarOpen}/>
      </div>
    </>
  );
}