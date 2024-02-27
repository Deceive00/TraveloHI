// LanguageSelector.js

import { useCurrency } from "../../../context/CurrencyContext";
import style from "./LanguageSelector.module.scss";
import IndonesiaFlag from "/images/language/indonesia.png";
import EnglishFlag from "/images/language/united-kingdom.png";
const LanguageSelector = ({
  position,
  onClose,
  setLanguage,
}: {
  position: any;
  onClose: any;
  setLanguage: any;
}) => {
  const {setCurrency} = useCurrency();
  const handleLanguageSelectorClick = (flag : any) => {
    setCurrency(flag)
    onClose()
  }
  return (
    <>
      <div
        className={style.languageSelector}
        style={{ position: "absolute", top: position.top, left: position.left - 30}}
      >
        <span
          onClick={() => handleLanguageSelectorClick('Rupiah')}
          className={style.languageContainer}
        >
          <img src={IndonesiaFlag} alt="" />
          <span>Rupiah</span>
        </span>
        <span
          onClick={() => handleLanguageSelectorClick('USD')}
          className={style.languageContainer}
        >
          <img src={EnglishFlag} alt="" />
          <span>USD</span>
        </span>
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

export default LanguageSelector;
