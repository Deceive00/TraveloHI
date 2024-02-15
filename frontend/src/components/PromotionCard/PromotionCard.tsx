import React from "react";
import style from "./PromotionCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from '@fortawesome/free-solid-svg-icons';

interface IPromotionCardProps {
  promotion: IPromotion;
  image?: string | null;
}

export default function PromotionCard({
  promotion,
  image,
}: IPromotionCardProps) {
  const formatDate = (inputDateString: string, mode : string) => {
    console.log(inputDateString);

    if (!inputDateString) {
      return "";
    }
    const date = new Date(inputDateString);
    let options: Intl.DateTimeFormatOptions;
    if(mode === "start"){
      options = {
        day: "numeric",
        month: "short",
      };
    }
    else{
      options = {
        day: "numeric",
        month: "short",
        year: "numeric",
      };
    }

    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  };
  console.log(promotion);
  return (
    <main className={style.promotionCard}>
      <div className={style.backgroundImage}>
        <img src={image! || promotion.promotionImage} alt={promotion.promotionCode} />
      </div>
      <div className={style.blackOverlay}>
        <div className={style.leftSide}>
          <div className={style.percentIconContainer}>
            <div className={style.circleBackground}>
              <FontAwesomeIcon icon={faPercent} className={style.percentIcon} />
            </div>
          </div>
          <div className={style.promoTextContainer}>
            <span className={style.promotionName}>
              {promotion.promotionName}
            </span>
            <span className={style.promotionPercentage}>
              {promotion.promotionPercentage}%
            </span>
          </div>
          <div className={style.termAndCondition}>
            *with Terms and condition
          </div>
        </div>
        <div className={style.rightSide}>
          <div className={style.dateContainer}>
            <p>
              Valid only on 
              {` ${formatDate(promotion.promotionStartDate, 'start')}`} -{" "}
              {formatDate(promotion.promotionEndDate,'end')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
