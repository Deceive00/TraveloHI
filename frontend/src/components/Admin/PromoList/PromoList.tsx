import { FaArrowRightLong } from 'react-icons/fa6';
import style from './PromoList.module.scss'

interface IPromoListProps{
  promotions: IPromotion;
  onClick: any;
  isActive: boolean;
}

const formatDate = (inputDateString: string) => {

  if (!inputDateString) {
    return "";
  }
  const date = new Date(inputDateString);
  let options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};
export default function PromoList({promotions, onClick, isActive} : IPromoListProps){
  return(
    <div className={`${style.promoListContainer} ${isActive ? style.active : ''}`} onClick={() => onClick(promotions)}>
      <div className={style.leftContainer}>
        <h4>{promotions.promotionCode}</h4>
        <p>{formatDate(promotions.promotionStartDate)} - {formatDate(promotions.promotionEndDate)}</p>
      </div>
      <div className={style.rightContainer}>
        <FaArrowRightLong/>
      </div>
    </div>
  )
}