import { CiEdit } from "react-icons/ci";
import { useCurrency } from "../../../context/CurrencyContext";
import style from "./HotelCartCard.module.scss";
import defaultImg from "/Background/bg.jpg";
import { getTotalDays } from "../../../utils/utils";
export default function HotelCartCard({
  hotelCart,
  handleEdit,
}: {
  hotelCart: IHotelCarts;
  handleEdit: any;
}) {
  const { getCurrency, convertPrice } = useCurrency();
  const getDay = (dateStr: string) => {
    const date = new Date(dateStr);
    let options: Intl.DateTimeFormatOptions = {
      day: "numeric",
    };

    const dayOfWeek = new Intl.DateTimeFormat("en-US", options).format(date);
    if (parseInt(dayOfWeek) < 10) {
      return "0" + dayOfWeek;
    }
    return dayOfWeek;
  };
  const getMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    let options: Intl.DateTimeFormatOptions = {
      month: "short",
    };

    const dayOfWeek = new Intl.DateTimeFormat("en-US", options).format(date);
    if (parseInt(dayOfWeek) < 10) {
      return "0" + dayOfWeek;
    }

    return dayOfWeek;
  };
  if(hotelCart){
    return (
      <div className={style.container}>
      <div className={style.leftContainer}>
        <div className={style.imageContainer}>
          <img src={hotelCart?.Room?.roomPicture[0] || defaultImg} alt={defaultImg} />
        </div>
        <div className={style.hotelDetail}>
          <h5>{hotelCart?.Hotel.hotelName}</h5>
          <p>{hotelCart?.Room.roomName}</p>
          <h5 className={style.price}>
            {getCurrency()}
            {convertPrice(hotelCart?.Room?.roomPrice).toLocaleString("en-US")}
          </h5>
        </div>
      </div>

      <div className={style.rightContainer}>
        <div className={style.topRightContainer}>
          {hotelCart && (<CiEdit onClick={() => handleEdit(hotelCart)} />)}
        </div>
        <div className={style.totalHotelPrice}>
          <p>
            Total price: {getCurrency()}
            {(hotelCart?.Room.roomPrice || 1) * (hotelCart?.totalRooms || 1) * (getTotalDays(hotelCart?.checkInDate, hotelCart?.checkOutDate))}
          </p>
        </div>
        <div className={style.bottomRightContainer}>
          <div className={style.dateFormat}>
            <h2>{getDay(hotelCart.checkInDate)}</h2>
            <h6>{getMonth(hotelCart.checkInDate)}</h6>
          </div>
          <div className={style.dateRange}>---</div>
          <div className={style.dateFormat}>
            <h2>{getDay(hotelCart.checkOutDate)}</h2>
            <h6>{getMonth(hotelCart.checkOutDate)}</h6>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
