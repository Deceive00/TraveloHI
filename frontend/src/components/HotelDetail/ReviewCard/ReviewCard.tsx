import { round } from 'lodash'
import style from './ReviewCard.module.scss'
import { FaCircle } from 'react-icons/fa';

export default function ReviewCard({review} : {review: Review}){
  const formattedRating = review?.overallRating.toFixed(1);
  return(
    
    <div className={style.container}>
      <div className={style.topReviewContainer}>
        <p className={style.overallRating}>{formattedRating}<span>/5</span></p>
        <p>{review.reviewDate}</p>
      </div>
      <div className={style.userContainer}>
        <p className={style.username}>{review.username}</p>
        <FaCircle/>
        <p>trip with friends</p>
      </div>
      <p className={style.reviewDescription}>
        {review.reviewDescription}
      </p>
    </div>
  )
}