import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import MainTemplate from "../../templates/main-template";
import style from "./history-page.module.scss";
import { getAllData } from "../../utils/utils";
import Snackbar from "../../components/form/Snackbar";
import FlightCartCard from "../../components/Cart/FlightCartCard/FlightCartCard";
import HotelCartCard from "../../components/Cart/HotelCartCard/HotelCartCard";

interface IProduct {
  flightCarts: IFlightCarts[];
  hotelCarts: IHotelCarts[];
}

const filterOptions = [
  { label: "All", value: "All" },
  { label: "Flight", value: "Flight" },
  { label: "Hotel", value: "Hotel" },
];

export default function HistoryPage() {
  const [history, setHistory] = useState<IProduct>();
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    getAllData("/history", setHistory, setLoading, showSnackbar);
  }, []);

  const handleFilterChange = (filterValue: string) => {
    setSelectedFilter(filterValue);
  };

  const filteredHistory = () => {
    if (!history) return { flightCarts: [], hotelCarts: [] };
    if (selectedFilter === "Flight") {
      return { flightCarts: history?.flightCarts, hotelCarts: [] };
    } else if (selectedFilter === "Hotel") {
      return { flightCarts: [], hotelCarts: history?.hotelCarts };
    } else {
      return history;
    }
  };

  return (
    <MainTemplate>
      <>
        <div className={style.content}>
          <h1>History</h1>
          <div className={style.typeFilter}>
            {filterOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange(option.value)}
                className={`${
                  selectedFilter === option.value ? style.active : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className={style.productContainer}>
            {filteredHistory().flightCarts?.map((flightCart, index) => (
              <FlightCartCard flightCart={flightCart} key={index}/>
            ))}
            {filteredHistory().hotelCarts?.map((hotelCart, index) => (
              <HotelCartCard hotelCart={hotelCart} handleEdit={() => {}} key={index}/>
            ))}
          </div>
        </div>
        <Footer />
        <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          show={snackbarOpen}
          setShow={setSnackbarOpen}
        />
      </>
    </MainTemplate>
  );
}
