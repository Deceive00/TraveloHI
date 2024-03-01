import style from "./Navbar.module.scss";
import logo from "../../assets/travelohiLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import ProfilePicture from "../form/ProfilePicture";
import { useTheme } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "./NavbarPopover/LanguageSelector";
import IndonesiaFlag from '/images/language/indonesia.png';
import EnglishFlag from '/images/language/united-kingdom.png';
import { useCurrency } from "../../context/CurrencyContext";
import { HiChevronDown } from "react-icons/hi2";
import PayContent from "./NavbarPopover/PayContent";
import { BiCart } from "react-icons/bi";
export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { currency } = useCurrency();
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [languageSelectorPosition, setLanguageSelectorPosition] = useState({
    top: 0,
    left: 0,
  });
  const [openPay, setOpenPay] = useState(false);
  const [payPosition, setPayPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleLanguageSelectorClick = (e : any) => {
    const buttonRect = e.target.getBoundingClientRect();
    setLanguageSelectorPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
    setShowLanguageSelector(!showLanguageSelector);
  };
  const handlePaySelectorClick = (e : any) => {
    const buttonRect = e.target.getBoundingClientRect();
    setPayPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
    console.log('here')
    setOpenPay(!openPay);
  };

  return (
    <nav className={scrolled ? style.scrolledNavbar : ""}>
      <div className={style.navbarContainer}>
        <div className={style.leftNavbarContainer}>
          <Link to={"/"} className={style.homeButtonContainer}>
            <img src={logo} alt="logo.png" className="imported-logo" />
            <h3>travelohi</h3>
          </Link>
          {/* <Searchbar/> */}
        </div>
        <div className={style.rightNavbarContainer}>
          <div className={style.cart} onClick={() => navigate('/cart')}>
            <BiCart/>
          </div>
          <div className={style.language}>
            <span onClick={handlePaySelectorClick} className={style.languageContainer}>
              Pay <HiChevronDown/>
            </span>
            {openPay && (
              <PayContent
                position={payPosition}
                onClose={() => setOpenPay(false)}
              />
            )}
          </div>
          <div className={style.language}>
            <span onClick={handleLanguageSelectorClick} className={style.languageContainer}>
              <img src={currency === 'USD' ? EnglishFlag : IndonesiaFlag} alt="" />
            </span>
            {showLanguageSelector && (
              <LanguageSelector
                isOpen={showLanguageSelector}
                position={languageSelectorPosition}
                onClose={() => setShowLanguageSelector(false)}
              />
            )}
          </div>
          <button onClick={toggleTheme} className={style.themeButton}>
            {theme === "dark" ? (
              <FontAwesomeIcon
                icon={faSun}
                className={`${style.light} ${style.glow}`}
              />
            ) : (
              <FontAwesomeIcon icon={faMoon} className={style.dark} />
            )}
          </button>
          {!user && (
            <div>
              <button
                onClick={() => navigate("/login")}
                className={style.loginButton}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={style.registerButton}
              >
                Sign Up
              </button>
            </div>
          )}
          {user && (
            <div className={style.rightContentContainer}>
              <div
                onClick={() => navigate("/personal-information")}
                className={style.profileContainer}
              >
                <ProfilePicture
                  label={"profilePicture"}
                  className="navbar-picture"
                  currentImg={user?.profilePicture}
                  disabled={true}
                />
                <span>{user.firstName}</span>
              </div>
              <div className={style.logoutButtonContainer}>
                <button onClick={() => logout()} className={style.loginButton}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
