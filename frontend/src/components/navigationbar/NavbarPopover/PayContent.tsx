// LanguageSelector.js

import { BiWallet } from "react-icons/bi";
import style from "./LanguageSelector.module.scss";

import { CiCreditCard1 } from "react-icons/ci";
const PayContent = ({
  position,
  onClose,
}: {
  position: any;
  onClose: any;
}) => {

  return (
    <>
      <div
        className={style.payContent}
        style={{ position: "absolute", top: position.top, left: position.left - 80}}
      >
        <div className={style.payContentContainer}>
          <h6>Payment Method</h6>
          <p>From Travelohi</p>
          <div className={style.flex}>
            <BiWallet/>
            <p>HI Wallet</p>
            <CiCreditCard1/>
            <p>Credit Card</p>
          </div>
          <div>
            <p>Another Method</p>
            <div className={style.flex}>
              <BiWallet/>
              <p>HI Debt</p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "100vh",
          width: "100vh",
          position: "fixed",
          zIndex: "-999",
        }}
        onClick={onClose}
      ></div>
    </>
  );
};

export default PayContent;
