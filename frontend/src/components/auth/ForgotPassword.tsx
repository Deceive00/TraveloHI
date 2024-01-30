import { useState } from "react";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../Loading/Loading";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import TextField from "../form/Textfield";
import style from '../../style/forgotpw.module.scss'
import Snackbar from "../form/Snackbar";

export default function ForgotPassword({closeMenu} : {closeMenu : any}){
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 
  const [openQuestion, setOpenQuestion] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [openNewPassword, setOpenNewPassword] = useState(false);
  const { register: registerAnswer, handleSubmit: handleSubmitAnswer, formState : {errors: errorAnswer }} = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState : {errors: errorPassword }} = useForm();
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState('error')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  let timer: NodeJS.Timeout;
  
  const handleShowQuestion = async () => {
    try {
      setLoading(true);
      const body = JSON.stringify({email: email})
      const response = await axios.post('http://localhost:8080/api/reset-password/verify-forgot-pw-email', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.status === 200){
        console.log('Email is valid');
        setQuestions(response.data.questions);
        setOpenQuestion(!openQuestion);
      }
      else {
        console.error('Email is not valid: ', response.statusText);
      }

      setLoading(false);
    } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const responseData = axiosError.response?.data;
          if (typeof responseData === 'object' && responseData !== null && 'error' in responseData) {
              console.error('Answer is not valid details:', responseData.error);
              setSnackbarMessage(responseData.error as string);
          }
          setSnackbarType('error');
          setSnackbarOpen(true);
        }
    } finally{
      setLoading(false);
    }
  }

  const handleAnswers = async (data : any) => {
    try{
      setLoading(true);
      const body = JSON.stringify({email: email, answer: data.answer, question: questions[0]})
      const response = await axios.post('http://localhost:8080/api/reset-password/verify-security-answer', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.status === 200){
        console.log('Answer is valid');
        setOpenNewPassword(true);
    
      }
      else {
        console.error('Answer is not valid: ', response.statusText);
        setSnackbarMessage(response.data.error); 
        setSnackbarType('error');
        setSnackbarOpen(true);
      }

      setLoading(false);
    } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const responseData = axiosError.response?.data;
          if (typeof responseData === 'object' && responseData !== null && 'error' in responseData) {
              console.error('Answer is not valid details:', responseData.error);
              setSnackbarMessage(responseData.error as string);
          }
          setSnackbarType('error');
          setSnackbarOpen(true);
        }
    }
    finally{
      setLoading(false);
    }
  }

  const handleNewPassword = async(data : any) => {
    try{
      setLoading(true);
      const body = JSON.stringify({email: email, newPassword: data.password, confirmationPassword: data.confirmationPassword})
      const response = await axios.post('http://localhost:8080/api/reset-password/verify-new-password', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.status === 200){
        console.log('Password is valid');
        
        setSnackbarMessage('Password changed succesfully')
        setSnackbarType('success')
        setSnackbarOpen(true);
        timer = setTimeout(() => {
          closeMenu();
          clearTimeout(timer)
        }, 3000);
      }
      else {
        console.error('Password is not valid: ', response.statusText);
        setSnackbarMessage(response.data.error); 
        setSnackbarType('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error changing password:', error);
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
    }finally{
      setLoading(false);
    }
  
  }
  if(loading){
    return <Loading/>
  }

  return (
    <>
      {loading && <Loading />}
      {!openQuestion && !openNewPassword && (
        <div style={{ width: '100%', height: '8vh' }}>
          <div className="input-container" style={{ margin: 0 }}>
            <FontAwesomeIcon icon={faEnvelope} className='icon' />
            <input
              type="email"
              className={`input-field ${emailError !== '' ? 'error' : ''}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailError !== '' && <div className="error-message">{emailError as string ?? ''}</div>}
          <button style={{ width: '100%', marginTop: '2vh' }} className="submit-button" onClick={handleShowQuestion}>Forgot Password</button>
        </div>
      )}
      {openQuestion && !openNewPassword && (
        <div style={{ width: '100%', height: 'fit-content' }}>
          <TextField
            error={errorAnswer.answer}
            label={questions[0]}
            name={'answer'}
            register={registerAnswer}
            rules={{
              required: 'required',
            }}
            type={'text'}
          />
          <button style={{ width: '100%', marginTop: '2vh' }} className="submit-button" onClick={handleSubmitAnswer(handleAnswers)}>Forgot Password</button>
        </div>
      )}
      {openNewPassword && (
        <div style={{ width: '100%', height: 'fit-content' }}>
          <div className={style.newPasswordContainer}>
            <TextField
              error={errorPassword.password}
              label={'New Password'}
              name={'password'}
              register={registerPassword}
              rules={{
                required: 'required*',
                minLength: { value: 8, message: 'Password must be at least 8 characters.' },
                validate: (value : any) => {
                  const requirementsRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?[\]\\|]).*$/;
          
                  if (requirementsRegex.test(value)) {
                    return true;
                  }
          
                  return 'Password must include capital letters, lowercase letters, numbers, and special symbols.';
                },
              }}
              type={'password'}
            />

            <TextField
              error={errorAnswer.confirmationPassword}
              label={'Confirm Password'}
              name={'confirmationPassword'}
              register={registerPassword}
              rules={{
                required: 'required',
              }}
              type={'password'}
            />
          </div>
          <button style={{ width: '100%', marginTop: '2vh' }} className="submit-button" onClick={handleSubmitPassword(handleNewPassword)}>Change Password</button>
        </div>
      )}
      <Snackbar message={snackbarMessage} type={snackbarType} show={snackbarOpen} setShow={setSnackbarOpen} />
    </>
  );

}