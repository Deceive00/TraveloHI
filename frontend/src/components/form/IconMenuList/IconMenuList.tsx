import { useNavigate } from 'react-router-dom'
import style from './IconMenuList.module.scss'
import { useUser } from '../../../context/UserContext';
interface IconMenuListProps {
  text: string,
  icon: any,
  onClick: string,
  isActive: boolean
}
export default function IconMenuList({text, icon, onClick, isActive} : IconMenuListProps){
  const navigate = useNavigate();
  const {logout} = useUser();
  const handleClick = () => {
    if(onClick === 'logout'){
      logout();
    }
    else{
      navigate(`${onClick}`)
    }
  }
  return (
    <div className={`${style.container} ${isActive ? style.active : ''}`} onClick={handleClick}>
      {icon}
      <span>{text}</span>
    </div>
  )
}