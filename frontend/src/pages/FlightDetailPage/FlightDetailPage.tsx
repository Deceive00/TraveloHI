import { useParams } from "react-router-dom";
import MainTemplate from "../../templates/main-template";
import style from "./FlightDetailPage.module.scss";
import { useEffect, useState } from "react";
import { getAllData } from "../../utils/utils";
import Footer from "../../components/footer/Footer";
import Snackbar from "../../components/form/Snackbar";

import FlightProgress from "../../components/FlightProgress/FlightProgress";
import Middleware from "../../components/auth/Middleware";
import { HiChevronDown } from "react-icons/hi2";
import Modal from "../../components/Modal/Modal";
import { IoClose } from "react-icons/io5";
function formatDate(dateStr: any | undefined): string {
  if (!dateStr) return "No Date";
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate: string = date.toLocaleDateString("en-US", options);

  const timePart: string = formattedDate.split(", ")[1];

  return formattedDate.replace(timePart, ` ${timePart}`);
}
export default function FlightDetailPage() {
  let { flightId } = useParams();
  const [flightData, setFlightData] = useState<IFlightData>();
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedBaggageAddOn, setSelectedBaggageAddOn] = useState(0);
  const [isSeatChoiceOpen, setIsSeatChoiceOpen] = useState(false);
  const [seatData, setSeatData] = useState<ISeats[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<ISeats[]>([]);
  const [selectedSeatConfigurationIdx, setSelectedSeatConfigurationIdx] = useState(0);
  const handleBaggageChange = (event: any) => {
    setSelectedBaggageAddOn(Number(event.target.value));
  };
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  useEffect(() => {
    getAllData(`/flight/${flightId}`, setFlightData, setLoading, showSnackbar);
  }, [flightId]);
  const departureAirport =
    flightData?.FlightSchedules[0]?.FlightRoute?.DepartureAirport.airportName +
    " " +
    `(${flightData?.FlightSchedules[0]?.FlightRoute?.DepartureAirport?.airportCode})`;
  const isTransit = flightData?.Flight.isTransit;

  const getTotalPrice = (price: number) => {
    return price + selectedBaggageAddOn * 10;
  };
  const handleSeat = (seat: any, index : number) => {
    setSeatData(seat);
    setIsSeatChoiceOpen(true);
    setSelectedSeatConfigurationIdx(index);
  };
  useEffect(() => {
    if(seatData.length <= 0){
      setSeatData(flightData?.Seats[0] || []);
    }
  }, [flightData]);

  const handleSeatClicked = (clickedSeat: ISeats) => {
    const updatedSelectedSeats = [...selectedSeat]; 
    
    const existingSeatIndex = updatedSelectedSeats.findIndex(seat => seat.Airplane.ID === clickedSeat.Airplane.ID);
    
    if (existingSeatIndex !== -1) {
      updatedSelectedSeats[existingSeatIndex] = clickedSeat;
    } else {
      updatedSelectedSeats.push(clickedSeat);
    }
    
    setSelectedSeat(updatedSelectedSeats); 
  }
  
  useEffect(() => {
    console.log(selectedSeat)
  }, [selectedSeat]);

  return (
    <Middleware>
      <MainTemplate>
        <>
          <div className={style.flightDetailContainer}>
            <h1>
              {departureAirport} To{" "}
              {
                flightData?.FlightSchedules[
                  flightData?.FlightSchedules.length - 1
                ]?.FlightRoute?.ArrivalAirport?.airportName
              }{" "}
              (
              {
                flightData?.FlightSchedules[
                  flightData?.FlightSchedules.length - 1
                ]?.FlightRoute?.ArrivalAirport?.airportCode
              }
              )
            </h1>

            <div className={style.flightRoute}>
              <h2>Travel Details</h2>
              <div className={style.flightContent}>
                <div className={style.topFlightContainer}>
                  <div className={style.circleContainer}>
                    <div className={style.circle}></div>
                    <div className={style.line}></div>
                  </div>
                  <div className={style.topFlightContent}>
                    <h5>
                      {formatDate(flightData?.FlightSchedules[0].departureTime)}
                    </h5>
                    <span>{departureAirport}</span>
                  </div>
                </div>
                <FlightProgress
                  data={flightData?.FlightSchedules[0]}
                  flightData={flightData}
                  handleSeat={handleSeat}
                  seat={flightData?.Seats[0]}
                  selectedSeat={selectedSeat[0]}
                  index={0}
                />
                {isTransit && (
                  <>
                    {flightData?.FlightSchedules.slice(
                      1,
                      flightData.FlightSchedules.length
                    ).map((data: IFlightSchedule, index: number) => {
                      return (
                        <>
                          <div className={style.topFlightContainer} key={`contianer + ${index}`}>
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
                              <h5>{formatDate(data.arrivalTime)}</h5>
                              <span>
                                {data.FlightRoute.ArrivalAirport.airportName}
                              </span>
                            </div>
                          </div>
                          <FlightProgress
                            flightData={flightData}
                            data={data}
                            handleSeat={handleSeat}
                            seat={flightData.Seats[index + 1]}
                            key={`progress + ${index + 1}`}
                            selectedSeat={selectedSeat[index + 1]}
                            index={index+1}
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
                      {formatDate(
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
            <div className={style.luggageContainer}>
              <h2>Travel Add-Ons</h2>
              <div className={style.luggageContent}>
                <div className={style.topLuggage}>
                  <img
                    src="https://s-gk.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/platform-mweb-low/string/2021/07/28/466dd89f-f754-4070-b629-df01a1e5909b-1627458783275-aff826a2cbdcbc5e56d0e9a64298ba17.png"
                    alt=""
                  />
                  <div className={style.topLuggageText}>
                    <h4>Baggage</h4>
                    <p>
                      Clothes, shoes, souvenirs, and stuff. You sure{" "}
                      {flightData?.Flight.baggageMaxWeight} kg is enough?
                    </p>
                  </div>
                </div>
                <div className={style.bottomLuggage}>
                  <div className="gender-container">
                    <label className="form-control">
                      <input
                        type="radio"
                        name="baggage"
                        value={0}
                        checked={selectedBaggageAddOn === 0}
                        onChange={handleBaggageChange}
                      />
                      0 kg
                    </label>

                    <label className="form-control">
                      <input
                        type="radio"
                        name="baggage"
                        value={5}
                        checked={selectedBaggageAddOn === 5}
                        onChange={handleBaggageChange}
                      />
                      5 kg
                    </label>

                    <label className="form-control">
                      <input
                        type="radio"
                        name="baggage"
                        value={10}
                        checked={selectedBaggageAddOn === 10}
                        onChange={handleBaggageChange}
                      />
                      10 kg
                    </label>

                    <label className="form-control">
                      <input
                        type="radio"
                        name="baggage"
                        value={15}
                        checked={selectedBaggageAddOn === 15}
                        onChange={handleBaggageChange}
                      />
                      15 kg
                    </label>

                    <label className="form-control">
                      <input
                        type="radio"
                        name="baggage"
                        value={20}
                        checked={selectedBaggageAddOn === 20}
                        onChange={handleBaggageChange}
                      />
                      20 kg
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.totalPaymentContainer}>
              <div className={style.totalPaymentContent}>
                <div className={style.topPayment}>
                  <h4>Total Payment</h4>
                  <h4 className={style.totalPrice}>
                    $
                    {getTotalPrice(flightData?.Flight.flightPrice || 0) +
                      getTotalPrice(flightData?.Flight.flightPrice || 0) *
                        0.001}
                    <HiChevronDown />
                  </h4>
                </div>
                <div className={style.topPayment}>
                  <h5>Baggage Adds On</h5>
                  <h5 className={style.totalPrice}>
                    ${selectedBaggageAddOn * 10}
                  </h5>
                </div>
                <div className={style.topPayment}>
                  <h5>Platform Fee</h5>
                  <h5>
                    $
                    {getTotalPrice(flightData?.Flight.flightPrice || 0) * 0.001}
                  </h5>
                </div>
                <div className={style.payButtonContainer}>
                  <button className={style.buyNowButton}>Buy Now</button>
                  <button className={style.buyNowButton}>Add To Cart</button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
          <Snackbar
            message={snackbarMessage}
            type={snackbarType}
            show={snackbarOpen}
            setShow={setSnackbarOpen}
          />
          <Modal
            isOpen={isSeatChoiceOpen}
            onRequestClose={() => setIsSeatChoiceOpen(false)}
          >
            <>
              <IoClose className={style.closeBtn} onClick={() => setIsSeatChoiceOpen(false)}/>
              <div className={style.seatModal}>
                <h3>Choose Your Seat</h3>
                <div
                  className={style.seatContainer}
                  style={{
                    gridTemplateColumns: `repeat(${
                      seatData ? seatData[0]?.Airplane.seatColumn + (seatData[0]?.Airplane.seatColumn === 10 ? 2 : 1) : 6
                    }, 1fr)`,
                  }}
                >
                  {seatData?.map((seat: ISeats, index: number) => {
                    let flightGap = '';
                    if(seatData[0]?.Airplane.seatColumn === 10){
                      if((index + 1) % 10 === 3 || (index + 1)% 10 === 7){
                        flightGap ='2vw';
                      }
                    }
                    if(seatData[0]?.Airplane.seatColumn === 6){
                      if((index + 1) % 3 === 0 && (index + 1) % 6 !== 0){
                        flightGap ='2vw';
                      }
                    }
                    return (
                      <>
                        <div className={`${style.seatOptions} ${seat?.seatNumber === selectedSeat[selectedSeatConfigurationIdx]?.seatNumber ? style.isSelected: seat.isAvailable ? style.available : style.isNotAvailable}`} onClick={() => handleSeatClicked(seat)} key={seat.ID}>
                          <p>{seat.seatNumber}</p>
                        </div>
                        {flightGap !== '' && (
                          <div style={{width: flightGap, height:'100%'}}></div>
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          </Modal>
        </>
      </MainTemplate>
    </Middleware>
  );
}
