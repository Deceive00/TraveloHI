import style from '../HotelRecommendationHome.module.scss'
import { FaRegHeart, FaRegStar } from 'react-icons/fa';
import { round } from 'lodash';
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
interface HotelRecommendationHomeCard{
  hotel: Hotel;
}
export default function HotelRecommendationHomeCard({hotel} : HotelRecommendationHomeCard){
  const navigate = useNavigate();
  const handleNavigateDetail = () => {
    console.log(hotel.hotelId)
    navigate(`/hotel-detail/${hotel.hotelId}`)
  }
  return(
    <div className={style.cardContainer} onClick={handleNavigateDetail}>
      <div className={style.imageContainer}>
        <img src={hotel.hotelImage[0]} alt={hotel.hotelName} />
        <FaRegHeart className={style.heartIcon}/>
      </div>
      <div className={style.hotelDetailContainer}>
        <h4>{hotel.hotelName}</h4>
        <div className={style.location}>
          <CiLocationOn/>
          <p>{hotel.city}, {hotel.country}</p>
        </div>
        <div className={style.rating}>
          <FaRegStar/>
          <p>{round(hotel.hotelRating, 2)} (1000 Reviews)</p>
        </div>
      </div>
      <div className={style.priceContainer}>
        <div className={style.price}>
          <h4>$130</h4>
          <h5>$160</h5>
        </div>
        <p>Includes taxes & fees</p>
      </div>
    </div>
  );
}