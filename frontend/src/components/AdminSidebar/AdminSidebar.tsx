import { Link, useLocation } from 'react-router-dom';
import style from './AdminSidebar.module.scss'
import { ADMIN_MENU } from '../../utils/Items';
import IconMenuList from '../form/IconMenuList/IconMenuList';
export default function AdminSidebar(){
  const location = useLocation();
  return(
  <div className={style.sidebar}>
    <Link to={"/admin"} className={style.titleContainer}>
      <img
        src="/images/travelohiLogo.png"
        alt="logo.png"
        className="imported-logo"
      />
      <h3>Travelohi</h3>
    </Link>
    <div className={style.menus}>
      {ADMIN_MENU.map(({ icon, text, onClick }, index) => {
        return (
          <IconMenuList
            key={`iconmenulist ${index}`}
            icon={icon}
            text={text}
            onClick={onClick}
            isActive={location.pathname === onClick}
          />
        );
      })}
    </div>
  </div>
  )
}