import { GiAirplaneDeparture } from "react-icons/gi";
import style from "./FlightCartCard.module.scss";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { BsLuggageFill } from "react-icons/bs";
import { BiWallet } from "react-icons/bi";
import { useCurrency } from "../../../context/CurrencyContext";
interface IFlightCartCardProps {
  flightCart: IFlightCarts;
}
export default function FlightCartCard({ flightCart }: IFlightCartCardProps) {
  const { convertPrice, getCurrency} = useCurrency();
  function dateHourAndminutes(dateStr: Date): string {
    if (!dateStr) return "No Date";
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function dayAndMonth(dateStr: Date): string {
    if (!dateStr) return "No Date";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
    };

    const formattedDate: string = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }
  
  return (
    <div className={style.container}>
      <div className={style.leftContainer}>
        <div className={style.topLeftContainer}>
          <div className={style.time}>
            <p className={style.head}>
              {dateHourAndminutes(
                flightCart?.Tickets[0].FlightSchedule.departureTime
              )}
            </p>
            <p className={style.desc}>
              {dayAndMonth(flightCart?.Tickets[0].FlightSchedule.departureTime)}
            </p>
          </div>
          <div className={style.circle}></div>
          <div className={style.airport}>
            <p className={style.head}>
              {flightCart?.Tickets[0].FlightSchedule.FlightRoute.DepartureAirport.airportName} ({flightCart?.Tickets[0].FlightSchedule.FlightRoute.DepartureAirport.airportCode})
            </p>
            <p className={style.desc}>
              {flightCart?.Tickets[0].FlightSchedule.FlightRoute.DepartureAirport.City.cityName},               {flightCart?.Tickets[0].FlightSchedule.FlightRoute.DepartureAirport.City.Country.countryName}
            </p>
          </div>
        </div>
        <div className={style.topLeftContainer}>
          <div className={style.time}>
            <p className={style.head}>
              {dateHourAndminutes(
                flightCart?.Tickets[flightCart?.Tickets.length - 1].FlightSchedule.arrivalTime
              )}
            </p>
            <p className={style.desc}>
              {dayAndMonth(flightCart?.Tickets[flightCart?.Tickets.length - 1].FlightSchedule.arrivalTime)}
            </p>
          </div>
          <div className={style.circle}></div>
          <div className={style.airport}>
            <p className={style.head}>
              {flightCart?.Tickets[flightCart?.Tickets.length - 1].FlightSchedule.FlightRoute.ArrivalAirport.airportName} ({flightCart?.Tickets[0].FlightSchedule.FlightRoute.ArrivalAirport.airportCode})
            </p>
            <p className={style.desc}>
            {flightCart?.Tickets[flightCart?.Tickets.length - 1].FlightSchedule.FlightRoute.ArrivalAirport.City.cityName},               {flightCart?.Tickets[0].FlightSchedule.FlightRoute.DepartureAirport.City.Country.countryName}            </p>
          </div>
        </div>
      </div>
      <div className={style.rightContainer}>
        <div className={style.flex}>
          <MdAirlineSeatReclineExtra/>
          <p>Seats: {flightCart?.Tickets[0].Seat.seatNumber}</p>
        </div>
        <div className={style.flex}>
          <GiAirplaneDeparture/>
          <p>{flightCart?.Tickets[0].FlightSchedule.Airplane.airplaneName}</p>
        </div>
        <div className={style.flex}>
          <BsLuggageFill/>
          <p>Baggage: {flightCart?.Tickets[0].Flight.baggageMaxWeight + flightCart.Tickets[0].addOnBaggageWeight} kg</p>
        </div>
        <div className={style.flex}>
          <BiWallet/>
          <p>Price: {getCurrency()}{convertPrice(flightCart?.Tickets[0].Flight.flightPrice).toLocaleString()}</p>
        </div>
        <div className={`${style.flex} ${flightCart?.Tickets[0].status === 'unpaid' ? style.unpaid : style.paid}`}>
          <p className={style.status}>Status: {flightCart?.Tickets[0].status}</p>
        </div>
      </div>

    </div>
  );
}
