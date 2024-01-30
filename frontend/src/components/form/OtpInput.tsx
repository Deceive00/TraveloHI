import { useState } from "react";
import style from "../../style/OtpInput.module.scss"; 

const OtpInput = ({ length, onOtpChange } : {length : number, onOtpChange: (otp: string) => void }) => {
  const initialOtpValues = Array.from({ length }, () => '');
  const [otpValues, setOtpValues] = useState<string[]>(initialOtpValues);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let val = e.target.value;
  
    val = val.replace(/[^\d]/g, '');
  
    val = val.charAt(0);
  
    const newOtpValues = [...otpValues];
    newOtpValues[index] = val;
    setOtpValues(newOtpValues);
  
    e.target.value = val;
  
    if (val !== "" && index < length - 1) {
      const nextInput = e.target.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  
    const otp = newOtpValues.join('');
    onOtpChange(otp);console.log('hasil akhir  ' + otp)
  };
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key.toLowerCase();

    if ((key === "backspace" || key === "delete")) {
      // Handle backspace or delete key
      if (index > 0) {
        const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  return (
    <div className={style.container}>
      {[...Array(length)].map((_, index) => (
        <input
          key={index}
          className={style.input}
          type="text"
          inputMode="numeric"
          maxLength={length}
          onChange={(e) => handleInput(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index)}
        />
      ))}
    </div>
  );
};

export default OtpInput;
