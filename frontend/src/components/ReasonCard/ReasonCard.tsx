import style from './ReasonCard.module.scss'

interface IReasonCardProps{
  reason: IReason;
}
export default function ReasonCard({reason} : IReasonCardProps){
  return(
    <div className={style.container}>
      <div className={style.leftContainer}> 
        <img src={reason.image} alt={reason.title} />
      </div>
      <div className={style.rightContainer}>
        <h4>{reason.title}</h4>
        <p>{reason.description}</p>
      </div>
    </div>
  );
}