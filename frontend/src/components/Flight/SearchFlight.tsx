import { ChangeEvent, useState } from "react";
import style from "./SearchFlight.module.scss";
import parentStyle from "../home-page/SearchComponent/SearchComponent.module.scss";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import Loading from "../Loading/Loading";

import axios from "axios";
import { debounce } from "lodash";
import CustomSelectContainer from "../Search/CustomSelectContainer";
interface ISearchFlight {
  countries: Country[];
  cities: City[];
  airports: IAirport[];
}
const FILTER_OPTIONS = [
  "Business Class",
  "First Class",
  "Economy Class",
  "Non-transit",
  "Transit",
];

export default function SearchFlight() {
  const [loading, setLoading] = useState(false);
  const [departureData, setDepartureData] = useState<ISearchFlight>();
  const [arrivalData, setArrivalData] = useState<ISearchFlight>();
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isArrivalOpen, setIsArrivalOpen] = useState(false);
  const handleDepartureDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    setDepartureDate(date);
  };

  const handleCheckOutDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    setCheckOutDate(date);
  };

  const handleSearch = () => {
    const date = departureDate?.toISOString().split("T")[0] || null;
    navigate(
      `/flight/search?departureAirport=${encodeURIComponent(
        departureAirport
      )}&arrivalAirport=${encodeURIComponent(
        arrivalAirport
      )}&departureDate=${encodeURIComponent(date || "")}`
    );
  };
  const debouncedSearch = debounce(async (term: string, type: string) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/flight/search-name",
        {
          params: { term },
        }
      );
      console.log(response.data)
      if(type === 'departure'){
        setDepartureData(response.data);
      }
      if(type === 'arrival'){
        setArrivalData(response.data);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  }, 300);
  const handleInputDepartureChange = (event: any) => {
    const term = event.target.value;
    setDepartureAirport(term);
    debouncedSearch(term, 'departure');
  };
  const handleInputArrivalChange = (event: any) => {
    const term = event.target.value;
    setArrivalAirport(term);
    debouncedSearch(term, 'arrival');
  };
  const handleDepartureAirportClicked = (name: string) => {
    setDepartureAirport(name);
    setIsDepartureOpen(false);
  };
  const handleArrivalAirportClicked = (name: string) => {
    setArrivalAirport(name);
    setIsDepartureOpen(false);
  };
  return (
    <>
      {loading && <Loading />}
      <div className={style.flightSearchContainer}>
        <div className={style.inputContainer}>
          <div className="input-group">
            <label htmlFor="customSelect">City, Airports, Country</label>
            <CustomSelectContainer
              value={departureAirport}
              onChange={handleInputDepartureChange}
              isOpen={isDepartureOpen}
              setIsOpen={setIsDepartureOpen}
              options={departureData}
              handleNameOptionsClicked={handleDepartureAirportClicked}
            />
          </div>
        </div>
        <div className={style.inputContainer}>
          <div className="input-group">
            <label htmlFor="customSelect">City, Airports, Country</label>
            <CustomSelectContainer
              value={arrivalAirport}
              onChange={handleInputArrivalChange}
              isOpen={isArrivalOpen}
              setIsOpen={setIsArrivalOpen}
              options={arrivalData}
              handleNameOptionsClicked={handleArrivalAirportClicked}
            />
          </div>
        </div>
        <div className={style.inputContainer}>
          <div className="input-group">
            <label htmlFor="check-in-date">Departure Date</label>
            <input
              type="date"
              id="departure-date"
              name="departure-date"
              className="form-input"
              value={
                departureDate ? departureDate.toISOString().split("T")[0] : ""
              }
              onChange={handleDepartureDateChange}
            />
          </div>
        </div>
        <div className={style.inputContainer}>
          <div className="input-group">
            <label htmlFor="check-out-date">Return Date</label>
            <input
              type="date"
              id="check-out-date"
              name="check-out-date"
              className="form-input"
              value={
                checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""
              }
              onChange={handleCheckOutDateChange}
            />
          </div>
        </div>
      </div>
      <div className={parentStyle.searchButtonContainer}>
        <div className={parentStyle.leftSideSearchButtonContainer}>
          <span>Filter: </span>
          <div className={parentStyle.filterOptionContainer}>
            {FILTER_OPTIONS.map((item: string) => (
              <div className={parentStyle.filterOption}>{item}</div>
            ))}
          </div>
        </div>
        <button
          className={parentStyle.searchButton}
          onClick={handleSearch}
          disabled={departureAirport === "" || arrivalAirport === ""}
        >
          <p>Search</p>
          <FaArrowRightLong />
        </button>
      </div>
    </>
  );
}
