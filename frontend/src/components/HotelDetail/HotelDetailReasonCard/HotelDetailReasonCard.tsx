import style from './HotelDetailReasonCard.module.scss'

interface IHotelDetailReasonCard{
  icon: string;
  header: string;
  description: string;
}

export default function HotelDetailReasonCard({ reason } : {reason: IHotelDetailReasonCard}){

  return(
    <div className={style.container}>
      <img src={reason.icon} alt="" />
      <div className={style.textContainer}>
        <h5>{reason.header}</h5>
        <p>{reason.description}</p>
      </div>
    </div>
  )
}