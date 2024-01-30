// OtpModal.js
import { useState } from "react";
import Modal from "./Modal";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from '../../style/Modal.module.scss'
const OtpModal = ({ isOpen, onRequestClose, onClose }: { isOpen: boolean, onRequestClose: any, onClose: any }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [sent, isSent] = useState(false);
  const handleOtpChange = (e: any) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {
        !sent && (
          <div style={{width:'100%'}}>
            <div className="input-container">
              <FontAwesomeIcon icon={faEnvelope} className='icon' />
              <input
                type="email"
                className={`input-field ${error !== '' ? "error" : ""}`}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="submit-button">Send OTP</button>
          </div>
        )
      }
      {
        sent && (
          <div>
            <p>Enter the OTP sent to your email:</p>
            <input type="text" placeholder="Enter OTP" onChange={handleOtpChange} />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </div>
        )
      }
    </Modal>
  );
};

export default OtpModal;
