import style from './Navbar.module.scss'
import logo from "../../assets/travelohiLogo.png";
import Searchbar from '../form/Searchbar/Searchbar';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";

export default function Navbar(){
  const navigate = useNavigate();
  const { user, logout } = useUser();
  return(
    <nav>
      <div className={style.navbarContainer}>
        <div className={style.leftNavbarContainer}>
          <img src={logo} alt="logo.png" className="imported-logo" />
          <h3>traveloHI</h3>
          <Searchbar/>
        </div>
        <div className={style.rightNavbarContainer}>
          {
            !user && (
              <>
                <button onClick={() => navigate('/login')} className={style.loginButton}>Login</button>
                <button onClick={() => navigate('/signup')} className={style.registerButton}>Sign Up</button>
              </>
            )
          }
          {
            user && (
              <button onClick={() => logout()} className={style.loginButton}>Logout</button>
            )
          }
        </div>
      </div>
    </nav>
  );
}