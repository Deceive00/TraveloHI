import { MdDelete } from "react-icons/md";
import { getBankImage } from "../../../utils/Items";
import style from './CreditCardList.module.scss'
export default function CreditCardList({ card, onDelete }: { card: ICreditCard, onDelete: any }) {
  const logo = getBankImage(card.bankName);
  return (
    <div className={style.creditCardListContainer}>
      <div className={style.leftContainer}>
        <img src={logo} alt={card.bankName} />
        <div className={style.accountDetails}>
          <p className={style.bankName}>{card.bankName}</p>
          <h5 className={style.accountNumber}>{card.accountNumber}</h5>
          <p className={style.accountName}>{card.accountName}</p>
        </div>
      </div>
      <div className={style.rightContainer}>
        <MdDelete style={{color:'red'}} onClick={() => onDelete(card.id)}/>
      </div>
    </div>
  );
}
