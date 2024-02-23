import Star from "../Star/Star";
import style from "./SearchHotelCard.module.scss";
import DEFAULT_IMAGE from '/images/no-photo.png';
import logo from '/images/travelohiLogo.png';
import { FaHotel } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
export default function SearchHotelCard({ hotel }: { hotel: HotelSearch }) {
  const formattedRating = hotel?.overallRating.toFixed(1);
  return (
    <div className={style.container}>
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
        <div className={style.topCenter}>
          <p>{hotel.hotelName}</p>
          <div className={style.hotelRating}>
            <h6><img src={logo} alt="" style={{width:'23px', height:'23px'}}/>{formattedRating} <span>(1K)</span></h6>
            <p>Impressive</p>
          </div>
        </div>
        <div className={style.typeAndStarContainer}>
          <div className={style.typeContainer}>
            <FaHotel/>
            <p>Hotel</p>
          </div>
          <Star star={hotel.hotelStar}/>
        </div>
        <div>
          
        </div>
      </div>
      <div className={style.rightSearchHotelCard}></div>
    </div>
  );
}
