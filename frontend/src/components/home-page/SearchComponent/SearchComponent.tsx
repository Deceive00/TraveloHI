import { useState } from "react";
import axios from "axios";
import { debounce } from "lodash"; // or any debounce library
import style from "./SearchComponent.module.scss";
import { FaRegBuilding, FaRegUser } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const FILTER_OPTIONS = ["Hotels", "Villas" ,"Apartments", "Resorts", "Cottages"]

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryResults, setCountryResults] = useState<Country[]>([]);
  const [cityResults, setCityResults] = useState<City[]>([]);
  const [hotelResults, setHotelResults] = useState<Hotel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();
  const handleNameOptionsClicked = (name: string) => {
    setSelectedOption(name);
    setSearchTerm(name);
    setIsOpen(false);
  };
  const handleNameInputClicked = () => {
    setIsOpen(!isOpen);
  };
  const debouncedSearch = debounce(async (term) => {
    try {
      const response = await axios.get("http://localhost:8080/api/search-name", {
        params: { term },
      });
      const { countries, cities, hotels } = response.data;
      setCountryResults(countries);
      setCityResults(cities);
      setHotelResults(hotels);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  }, 300);

  const handleInputChange = (event: any) => {
    const term = event.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleSearch = () => {
    navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
  }
  return (
    <div className={style.searchContentContainer}>
      <div className={style.searchComponent}>
        <div className={style.nameInputContainer}>
          <div className="input-group">
            <label htmlFor="customSelect">City, Hotels, Country</label>
            <div className={style.customSelectContainer}>
              <div className={style.selectContainer}>
                <div className="input-container">
                  <FaRegBuilding className="icon" color="#0194f3"/>
    
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="form-input"
                    onClick={handleNameInputClicked}
                    style={{ paddingLeft: "calc(2.5rem - 0.25vw)" }}
                  />
                </div>
                {isOpen && (
                  <ul className={style.optionsList}>
                    {countryResults.map((option: Country, index: any) => (
                      <li
                        key={index}
                        className={style.option}
                        onClick={() =>
                          handleNameOptionsClicked(option.countryName)
                        }
                      >
                        <span>{option.countryName}</span>{" "}
                        <span className={style.nameType}>Country</span>
                      </li>
                    ))}
                    {cityResults.map((option: City, index: any) => (
                      <li
                        key={index}
                        className={style.option}
                        onClick={() =>
                          handleNameOptionsClicked(option.cityName)
                        }
                      >
                        <span>{option.cityName}</span>{" "}
                        <span className={style.nameType}>City</span>
                      </li>
                    ))}
                    {hotelResults.map((option: Hotel, index: any) => (
                      <li
                        key={index}
                        className={style.option}
                        onClick={() =>
                          handleNameOptionsClicked(option.hotelName)
                        }
                      >
                        <span>{option.hotelName}</span>{" "}
                        <span className={style.nameType}>Hotel</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={style.dateContainer}>
          <div className="input-group">
            <label htmlFor={"check-in-date"}>Check In Date</label>
            <input
              type="date"
              id={"check-in-date"}
              name={"check-in-date"}
              className="form-input"
            />
          </div>
        </div>
        <div className={style.dateContainer}>
          <div className="input-group">
            <label htmlFor={"check-out-date"}>Check Out Date</label>
            <input
              type="date"
              id={"check-out-date"}
              name={"check-out-date"}
              className="form-input"
            />
          </div>
        </div>
        <div className={style.dateContainer}>
          <div className="input-group">
            <label htmlFor={"total-guest"}>Total Guests</label>
            <div className="input-container">
              <FaRegUser className="icon" color="#0194f3" />
              <input
                type="number"
                id={"total-guest"}
                name={"total-guest"}
                placeholder="Total guest"
                className="form-input"
                style={{ paddingLeft: "calc(2.5rem - 0.25vw)" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style.searchButtonContainer}>
        <div className={style.leftSideSearchButtonContainer}>
          <span>Filter: </span>
          <div className={style.filterOptionContainer}>
            {
              FILTER_OPTIONS.map((item : string) => (
                <div className={style.filterOption}>
                  {item}
                </div>
              ))
            }
          </div>
        </div>
        <button className={style.searchButton} onClick={handleSearch}>
          <p>Search</p>
          <FaArrowRightLong/>
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
