import { GiCarSeat, GiForkKnifeSpoon } from "react-icons/gi";
import style from "../../pages/FlightDetailPage/FlightDetailPage.module.scss";
import { FaCircle, FaSuitcase } from "react-icons/fa";
interface IFlightProgressProps {
  flightData: IFlightData | undefined;
  data: IFlightSchedule | undefined;
  handleSeat?: any;
  seat?: any;
  selectedSeat?: ISeats | undefined;
  index: number;
}
export default function FlightProgress({
  flightData,
  data,
  handleSeat,
  seat,
  selectedSeat,
  index
}: IFlightProgressProps) {
  const handlePickSeat = () => {
    if(handleSeat){
      handleSeat(seat, index);
    }

  };
  return (
    <>
      <div className={style.centerFlightContent}>
        <div className={style.airlineContainer}>
          <div className={style.lineContainer}>
            <div className={style.lineCenter}></div>
          </div>
          <div className={style.centerContent}>
            <div className={style.topCenterContent}>
              <div className={style.airlineImageContainer}>
                <img src={data?.Airplane.Airline.airlineImage} alt="" />
              </div>
              <div className={style.airlineNameContainer}>
                <h5>{data?.Airplane.Airline.airlineName}</h5>
                <div className={style.durationContainer}>
                  <p>
                    {data?.Airplane.Airline.airlineCode}-
                    {data?.FlightRoute.flightRouteCode}
                  </p>
                  <FaCircle />
                  <p> {data?.Airplane.airplaneName}</p>
                  <FaCircle />
                  <p>
                    {data?.FlightRoute?.duration !== undefined
                      ? Math.floor(data?.FlightRoute.duration / 60)
                      : ""}
                    h
                    {data?.FlightRoute?.duration !== undefined
                      ? ` ${data.FlightRoute.duration % 60}m`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className={style.bottomCenterContentContainer}>
              <h5>What's Included</h5>
              <div className={style.bottomCenterContent}>
                <div className={style.leftBotContent}>
                  <FaSuitcase />
                  <div>
                    <p>Cabin : {flightData?.Flight.cabinMaxWeight} kg</p>
                    <p>Baggage : {flightData?.Flight.baggageMaxWeight} kg</p>
                  </div>
                </div>
                <div className={style.rightBotContent}>
                  <GiForkKnifeSpoon />
                  <p>Include meals</p>
                </div>
              </div>
              <div style={{cursor:'pointer'}} className={style.seats} onClick={handlePickSeat}>
                <GiCarSeat/>
                <p>{selectedSeat ? `${selectedSeat?.seatNumber}`: 'Please choose a seat'}</p>
              </div>
              <h5 className={style.blue}>See other facilities</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
