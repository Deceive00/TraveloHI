import style from './Navbar.module.scss'
import logo from "../../assets/travelohiLogo.png";
import Searchbar from '../form/Searchbar/Searchbar';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from 'react';
import ProfilePicture from '../form/ProfilePicture';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

export default function Navbar(){
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return(
    <nav className={scrolled ? style.scrolledNavbar : ''}>
      <div className={style.navbarContainer}>
        <div className={style.leftNavbarContainer}>
          <Link to={'/'} className={style.homeButtonContainer}>
            <img src={logo} alt="logo.png" className="imported-logo" />
            <h3>travelohi</h3>
          </Link>
          <Searchbar/>
        </div>
        <div className={style.rightNavbarContainer}>
          <button onClick={toggleTheme} className={style.themeButton}>
            {theme === 'dark'? <FontAwesomeIcon icon={faLightbulb} className={`${style.light} ${style.glow}`}/> : <FontAwesomeIcon icon={faMoon} className={style.dark}/>}
          </button>
          {
            !user && (
              <div>
                <button onClick={() => navigate('/login')} className={style.loginButton}>Login</button>
                <button onClick={() => navigate('/signup')} className={style.registerButton}>Sign Up</button>
              </div>
            )
          }
          {
            user && (
              <div className={style.rightContentContainer}>
                <span onClick={() => navigate('/personal-information')}>                
                  <ProfilePicture
                  label={"profilePicture"}
                  className="navbar-picture"
                  currentImg={user?.profilePicture}
                  disabled={true}
                  />
                </span>
                <button onClick={() => logout()} className={style.loginButton}>Logout</button>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
}