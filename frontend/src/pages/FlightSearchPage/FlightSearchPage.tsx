import { useEffect, useState } from "react";
import style from "./FlightSearchPage.module.scss";
import axios from "axios";
import MainTemplate from "../../templates/main-template";
import SearchComponent from "../../components/home-page/SearchComponent/SearchComponent";
import Footer from "../../components/footer/Footer";
import FlightProgress from "../../components/FlightProgress/FlightProgress";
import { formatDateForFlight } from "../../utils/utils";
import Checkbox from "../../components/form/Checkbox/Checkbox";
import { useNavigate } from "react-router-dom";

export default function FlightSearchPage() {
  const [flightSegments, setFlightSegments] = useState<IFlightData[]>([]);
  const [searchTerm, setSearchTerm] = useState<any>({});
  const [transitOptions, setTransitOptions] = useState({
    noTransit: false,
    oneTransit: false,
    multipleTransits: false,
  });
  const navigate=  useNavigate();
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const departureAirport = params.get("departureAirport") || "";
        const arrivalAirport = params.get("arrivalAirport") || "";
        const departureDate = params.get("departureDate") || "";
        setSearchTerm({
          departureTerm: departureAirport,
          arrivalTerm: arrivalAirport,
          departureDate: departureDate,
        });

        console.log(departureAirport, arrivalAirport, departureDate);
        const response = await axios.get(
          `http://localhost:8080/api/flights/search`,
          {
            params: {
              departureTerm: departureAirport,
              arrivalTerm: arrivalAirport,
              departureDate: departureDate,
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setFlightSegments(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    fetchSearchResults();
  }, []);
  type TransitOption = "noTransit" | "oneTransit" | "multipleTransits";

  const handleCheckboxChange = (option: TransitOption) => {
    setTransitOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const filterFlightSegments = () => {
    return flightSegments.filter((segment) => {
      if(!transitOptions.noTransit && !transitOptions.multipleTransits && !transitOptions.oneTransit){
        return true;
      }
      if (transitOptions.noTransit && !segment?.Flight.isTransit) {
        return true;
      }
      if (transitOptions.oneTransit && segment?.FlightSchedules.length === 2) {
        return true;
      }
      if (
        transitOptions.multipleTransits &&
        segment?.FlightSchedules.length > 2
      ) {
        return true;
      }
      return false;
    });
  };
  const handleCardClick = (flightData: IFlightData) => {
    navigate(`/flight/${flightData.Flight.ID}`)
  }
  const filteredSegments = filterFlightSegments();

  return (
    <MainTemplate>
      <div className={style.body}>
        <div className={style.container}>
          <SearchComponent
            defaultValue={searchTerm}
            defaultOptions={"flight"}
          />
          <h2
            style={{
              textAlign: "left",
              width: "100%",
              fontSize: "calc(13px + 0.4vw)",
            }}
          >
            Displaying Results for {searchTerm.departureTerm} -{" "}
            {searchTerm.arrivalTerm}
          </h2>
          <div className={style.content}>
            <div className={style.filter}>
              <div className={style.filterContainer}>
                <h5>Transit</h5>
                <div className={style.transitOptionsContainer}>
                  <div className={style.transitOption}>
                    <Checkbox
                      id="noTransit"
                      value="No Transit"
                      checked={transitOptions.noTransit}
                      onChange={() => handleCheckboxChange("noTransit")}
                    />
                    <label htmlFor="noTransit">No Transit</label>
                  </div>
                  <div className={style.transitOption}>
                    <Checkbox
                      id="oneTransit"
                      value="1 Transit"
                      checked={transitOptions.oneTransit}
                      onChange={() => handleCheckboxChange("oneTransit")}
                    />
                    <label htmlFor="oneTransit">1 Transit</label>
                  </div>
                  <div className={style.transitOption}>
                    <Checkbox
                      id="multipleTransits"
                      value="2+ Transits"
                      checked={transitOptions.multipleTransits}
                      onChange={() => handleCheckboxChange("multipleTransits")}
                    />
                    <label htmlFor="multipleTransits">2+ Transit</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.flightList}>
              {filteredSegments.length <= 0 && <h2>No Flight Matched</h2>}
              {filteredSegments.length > 0 &&
                filteredSegments.map((flightData: IFlightData) => (
                  <div className={style.flightRoute} onClick={() => handleCardClick(flightData)}>
                    <h2 style={{ marginBottom: "1vh" }}>
                      {
                        flightData?.FlightSchedules[0]?.FlightRoute
                          .DepartureAirport.airportName
                      }{" "}
                      -{" "}
                      {
                        flightData?.FlightSchedules[
                          flightData?.FlightSchedules.length - 1
                        ]?.FlightRoute.ArrivalAirport.airportName
                      }
                    </h2>
                    <div className={style.flightContent}>
                      <div className={style.topFlightContainer}>
                        <div className={style.circleContainer}>
                          <div className={style.circle}></div>
                          <div className={style.line}></div>
                        </div>
                        <div className={style.topFlightContent}>
                          <h5>
                            {formatDateForFlight(
                              flightData?.FlightSchedules[0]?.departureTime
                            )}
                          </h5>
                          <span>
                            {
                              flightData?.FlightSchedules[0]?.FlightRoute
                                .DepartureAirport.airportName
                            }
                          </span>
                        </div>
                      </div>
                      <FlightProgress
                        data={flightData?.FlightSchedules[0]}
                        flightData={flightData}
                        index={0}
                      />
                      {flightData?.Flight?.isTransit && (
                        <>
                          {flightData?.FlightSchedules.slice(
                            1,
                            flightData.FlightSchedules.length
                          ).map((data: IFlightSchedule, index: number) => {
                            return (
                              <>
                                <div
                                  className={style.topFlightContainer}
                                  key={`contianer + ${index}`}
                                >
                                  <div
                                    className={style.circleContainer}
                                    style={{ marginTop: "-1vh" }}
                                  >
                                    <div className={style.line}></div>
                                    <div
                                      className={`${style.circle} ${style.circleFilled}`}
                                    ></div>
                                  </div>
                                  <div className={style.topFlightContent}>
                                    <h5>
                                      {formatDateForFlight(data.arrivalTime)}
                                    </h5>
                                    <span>
                                      {
                                        data?.FlightRoute.ArrivalAirport
                                          .airportName
                                      }
                                    </span>
                                  </div>
                                </div>
                                <FlightProgress
                                  flightData={flightData}
                                  data={data}
                                  key={`progress + ${index + 1}`}
                                  index={index + 1}
                                />
                              </>
                            );
                          })}
                        </>
                      )}
                      <div className={style.topFlightContainer}>
                        <div
                          className={style.circleContainer}
                          style={{ marginTop: "-1vh" }}
                        >
                          <div className={style.line}></div>
                          <div
                            className={`${style.circle} ${style.circleFilled}`}
                          ></div>
                        </div>
                        <div className={style.topFlightContent}>
                          <h5>
                            {formatDateForFlight(
                              flightData?.FlightSchedules[
                                flightData?.FlightSchedules.length - 1
                              ].arrivalTime
                            )}
                          </h5>
                          <span>
                            {
                              flightData?.FlightSchedules[
                                flightData?.FlightSchedules.length - 1
                              ].FlightRoute.ArrivalAirport.airportName
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </MainTemplate>
  );
}
