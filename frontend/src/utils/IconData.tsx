import { FaCocktail, FaCoffee, FaDumbbell, FaSwimmingPool, FaTshirt, FaBriefcase, FaSnowflake, FaUtensils, FaBath, FaBaby, FaHotTub, FaSpa, FaSwimmer, FaShuttleVan, FaPaw, FaClock, FaParking, FaDesktop, FaSmoking } from 'react-icons/fa';
import { FaElevator } from "react-icons/fa6";
import { BiSolidTennisBall } from "react-icons/bi";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaWifi } from "react-icons/fa";
import { RiRefundFill } from 'react-icons/ri';
export const FACILITY_ICONS = {
  "Semi open & outdoor restaurant": <FaUtensils />,
  "Bar/Lounge": <FaCocktail />,
  "Cafe": <FaCoffee />,
  "Gym": <FaDumbbell />,
  "Swimming Pool": <FaSwimmingPool />,
  "Laundry Service": <FaTshirt />,
  "Meeting Rooms": <FaBriefcase />,
  "AC": <FaSnowflake />,
  "Spa": <FaSpa />,
  "Playground": <FaBaby />,
  "Jacuzzi": <FaHotTub />,
  "Sauna": <FaSwimmer />,
  "Tennis Court": <BiSolidTennisBall />,
  "Airport Shuttle": <FaShuttleVan />,
  "Pet-Friendly": <FaPaw />,
  "24-Hour Front Desk": <FaClock />,
  "Parking": <FaParking />,
  "Elevator": <FaElevator />,
  "Public Computer": <FaDesktop />,
  "Water Purification System": <FaSnowflake />,
};

export const ROOM_FACILITIES = (type: string) => {
  switch(type){
    case "gotBreakfast":
      return <GiForkKnifeSpoon/>;
    case "gotFreeWifi":
      return <FaWifi/>;
    case "isRefundable":
      return <RiRefundFill/>;
    case "isReschedulable":
      return <RiRefundFill/>;
    case "isSmoking":
      return <FaSmoking/>;
  }
}