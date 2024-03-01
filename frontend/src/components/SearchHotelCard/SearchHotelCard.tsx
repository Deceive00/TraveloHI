import { useNavigate } from "react-router-dom";
import { getMinimumPrice } from "../../utils/utils";
import Star from "../Star/Star";
import style from "./SearchHotelCard.module.scss";
import DEFAULT_IMAGE from "/images/no-photo.png";
import logo from "/images/travelohiLogo.png";
import { FaHotel } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { HiMiniReceiptRefund } from "react-icons/hi2";
import { useCurrency } from "../../context/CurrencyContext";
export default function SearchHotelCard({ hotel }: { hotel: HotelSearch }) {
  const formattedRating = hotel?.overallRating.toFixed(1);
  const navigate = useNavigate();
  const {getCurrency, convertPrice} = useCurrency();
  const handleClick = () => {

    navigate(`/hotel-detail/${hotel.id}`)
  }
  return (
    <div className={style.container} onClick={handleClick}>
      <div className={style.leftSearchHotelCard}>
        <div className={style.mainImage}>
          <img src={hotel.hotelPicture[0]} alt="" />
        </div>
        <div className={style.additionalImages}>
          {hotel?.hotelPicture &&
            hotel?.hotelPicture.length > 1 &&
            hotel?.hotelPicture
              .slice(1, 4)
              .map((image: string, index: number) => {
                return (
                  <div className={style.seeAllHotelImageContainer} key={index}>
                    <img src={image} alt={DEFAULT_IMAGE} />
                  </div>
                );
              })}
        </div>
      </div>
      <div className={style.centerSearchHotelCard}>
        <div className={style.firstCenter}>
          <div className={style.topCenter}>
            <p className={style.hotelName}>{hotel.hotelName}</p>
            <div className={style.hotelRating}>
              <h6>
                <img
                  src={logo}
                  alt=""
                  style={{ width: "23px", height: "23px" }}
                />
                {formattedRating} <span>(1K)</span>
              </h6>
              <p>Impressive</p>
            </div>
          </div>
          <div className={style.typeAndStarContainer}>
            <div className={style.typeContainer}>
              <FaHotel />
              <p>Hotel</p>
            </div>
            <Star star={hotel.hotelStar} />
          </div>
          <div className={style.locationContainer}>
            <FaLocationDot />
            <p className={style.hotelAddress}>{hotel.hotelAddress}</p>
          </div>
          <div className={style.facilityContainer}>
            {hotel.facilities.slice(1, 4).map((facility: Facility) => {
              return (
                <div className={style.facilityOptions} key={facility.ID}>
                  <p>{facility.facilityName}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className={style.secondContainer}>
          <div className={style.typeContainer}>
            <HiMiniReceiptRefund />
            <p>Refund guarantee options available</p>
          </div>
        </div>
      </div>
      <div className={style.rightSearchHotelCard}>
        <div className={style.rightContainer}>
          <h5>{getCurrency()} {convertPrice((getMinimumPrice(hotel.rooms) * 110) / 100).toLocaleString()}</h5>
          <h4>{getCurrency()} {convertPrice(getMinimumPrice(hotel.rooms)).toLocaleString()}</h4>
          <span>Per room, per night</span>
          <div className={style.selectRoomBtnContainer}>
            <button className={style.selectRoomBtn}>Select Room</button>
          </div>
        </div>
      </div>
    </div>
  );
}
