import { useNavigate } from "react-router-dom";
import style from "../FlightRecommendationHome/FlightRecommendationHome.module.scss";
import defautlImg from "/images/empty-folder.png";
import { FaRegHeart } from "react-icons/fa";
import defaultFlight from '/Background/bg.jpg'
import { FaPlane } from "react-icons/fa6";
interface IFlightRecommendationCard {
  flightData: IFlightData;
}
export default function FlightRecommendationCard({
  flightData,
}: IFlightRecommendationCard) {
  const navigate = useNavigate();
  const handleNavigateDetail = () => {
    navigate(`/flight/${flightData.Flight.ID}`)
  };

  const formatDate = (dateStr: any) => {
    const date: Date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
      "en-US",
      options
    );
    const formattedDate: string = formatter.format(date);
    return formattedDate;
  };
  

  return (
    <div className={style.cardContainer} onClick={handleNavigateDetail}>
      <div className={style.imageContainer}>
        <img src={defaultFlight} alt={defautlImg} />
        <FaRegHeart className={style.heartIcon} />
      </div>
      <div className={style.flightDetailContainer}>
        <div className={style.destinationContainer}>
          <h4>
            {
              flightData?.FlightSchedules[0]?.FlightRoute?.DepartureAirport?.City
                ?.cityName
            }
          </h4>
          <FaPlane />
          <h4>
            {
              flightData?.FlightSchedules[flightData?.FlightSchedules?.length - 1]
                ?.FlightRoute?.DepartureAirport?.airportName
            }
          </h4>
        </div>
        <p>{formatDate(flightData?.FlightSchedules[0]?.departureTime)}</p>
        <div className={style.airline}>
          <img
            src={flightData?.FlightSchedules[0]?.Airplane?.Airline?.airlineImage}
            alt={defautlImg}
          />
        </div>
        <p>Economy | Business | First Class</p>
      </div>
      <div className={style.priceContainer}>
        <div className={style.price}>
          <h4>${flightData?.Flight.flightPrice}</h4>
          <h5>${flightData?.Flight.flightPrice * 110 / 100}</h5>
        </div>
        <p>Includes taxes & fees</p>
      </div>
    </div>
  );
}
