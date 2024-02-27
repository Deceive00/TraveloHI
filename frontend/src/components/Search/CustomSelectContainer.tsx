import React from "react";
import style from "./CustomSelectContainer.module.scss";
import { MdLocalAirport } from "react-icons/md";
interface ISearchFlight {
  countries: Country[];
  cities: City[];
  airports: IAirport[]
}
interface ICustomSelectContainerProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  options: ISearchFlight | undefined;
  handleNameOptionsClicked: (name: string) => void;
}

const CustomSelectContainer: React.FC<ICustomSelectContainerProps> = ({
  value,
  onChange,
  isOpen,
  setIsOpen,
  options,
  handleNameOptionsClicked,
}) => {
  console.log(options)
  return (
    <div className={style.customSelectContainer}>
      <div className={style.selectContainer}>
        <div className="input-container">
          <MdLocalAirport className="icon" color="#0194f3" />
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={onChange}
            className="form-input"
            onClick={() => setIsOpen(!isOpen)}
            style={{ paddingLeft: "calc(2.5rem - 0.25vw)" }}
          />
        </div>
        {isOpen && (
          <ul className={style.optionsList}>
          {options?.countries.map((option: Country, index: any) => (
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
          {options?.cities.map((option: City, index: any) => (
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
          {options?.airports.map((option: IAirport, index: any) => (
            <li
              key={index}
              className={style.option}
              onClick={() =>
                handleNameOptionsClicked(option.airportName)
              }
            >
              <span>{option.airportName} ({option.airportCode})</span>{" "}
              <span className={style.nameType}>Airport</span>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelectContainer;
