import { useEffect, useState } from "react";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Loading from "../Loading/Loading";
import OtpInput from "../form/OtpInput";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function LoginOTP(){
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [otpSent, setOtpSent] = useState(false);
  const [otpString, setOtpString] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useUser();
  const handleSendOTP = () => {
    setLoading(true); 
    setIsSending(true);
  };
  const handleVerifyOTP = () => {
    setLoading(true); 
    setIsVerifying(true);
  };

  useEffect(() => {
    const fetchOtp = async (_email : string) => {
      try {

        const body = JSON.stringify({email: _email})
        const response = await axios.post('http://localhost:8080/api/send-otp', body, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(response.status === 200){
          console.log('OTP sent');
        }
        else {
          console.error('OTP failed: ', response.statusText);
          setOtpError(response.data.error)
        }

        setLoading(false);
        setOtpSent(true);
        setIsSending(false);
      } catch (error) {
        console.error('Error fetching OTP:', error);
        setLoading(false);
        setIsSending(false);
      }
    };

    if (isSending) {
      fetchOtp(email);
    }

  }, [isSending]);

  useEffect(() => {
    const verifyOTP = async (_email : string, _otpString :string) => {
      const otpBody = JSON.stringify({ email: _email, code: _otpString});
      if(otpString.length < 6){
        setOtpError('Angka harus lebih dari 6!')
        return;
      }  
      else{
        setOtpError('')
      }
      
      const response = await axios.post('http://localhost:8080/api/verify-otp', otpBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      },);

      if(response.status === 200){
        setLoading(false);
        setIsVerifying(false);
        console.log('OTP Verified');
        await handleLogin()
        navigate('/home')
      }
      else {
        setLoading(false);
        setIsVerifying(false);
        console.error('OTP failed: ', response.statusText);
      }
      console.log(response.data.message);
      setLoading(false);
    }

    if(isVerifying){
      verifyOTP(email, otpString)
    }
  }, [isVerifying])

  if(loading){
    return <Loading/>
  }
  else if(!otpSent) return (
    <div style={{width:'100%', height:'8vh', }}>
      <div className="input-container" style={{margin:0}}>
        <FontAwesomeIcon icon={faEnvelope} className='icon' />
        <input
          type="email"
          className={`input-field ${otpError !== '' ? "error" : ""}`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

      </div>
      <button style={{width:'100%', marginTop:'2vh'}} className="submit-button" onClick={handleSendOTP}>Send OTP</button>
    </div>
  )
  else if(otpSent){
    return (
      <>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', }}>
          <OtpInput length={6} onOtpChange={(otp) => setOtpString(otp)}/>
        </div>
        <button style={{width:'100%', marginTop:'4vh'}} className="submit-button" onClick={handleVerifyOTP}>Verify OTP</button>
      </>
    )
  }
}