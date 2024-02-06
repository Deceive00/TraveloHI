import { useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { PROFILE_MENU } from '../../utils/Items';
import IconMenuList from '../form/IconMenuList/IconMenuList';
import ProfilePicture from '../form/ProfilePicture';
import style from './SettingSidebar.module.scss'
export default function SettingSidebar() {
  const location = useLocation();
  const {user} = useUser();
  return (
    <div className={style.leftPageContainer}>
      <div className={style.topLeftPageContainer}>
        <ProfilePicture
          label={"profilePicture"}
          className="profilepage-picture"
          currentImg={user?.profilePicture}
          disabled={true}
        />
        <h1>
          {user?.firstName} {user?.lastName}
        </h1>
      </div>
      <div className={style.bottomLeftPageContainer}>
        {PROFILE_MENU.map(({ icon, text, onClick }, index) => {
          if (onClick === "logout") {
            return (
              <>
                <div key={`margin ${index}`} style={{ height: "1vh" }}></div>
                <IconMenuList
                  key={`iconmenulist ${index}`}
                  icon={icon}
                  text={text}
                  onClick={onClick}
                  isActive={location.pathname === onClick}
                />
              </>
            );
          }
          return (
            <IconMenuList
              icon={icon}
              text={text}
              onClick={onClick}
              key={index}
              isActive={location.pathname === onClick}
            />
          );
        })}
      </div>
    </div>
  );
}
