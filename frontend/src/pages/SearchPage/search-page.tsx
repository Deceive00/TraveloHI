import axios from "axios";
import Navbar from "../../components/navigationbar/Navbar";
import style from "./search-page.module.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import { getAllData } from "../../utils/utils";
import Star from "../../components/Star/Star";
import Checkbox from "../../components/form/Checkbox/Checkbox";
import PriceRangeSlider from "../../components/PriceSlider/PriceRangeSlider";
import { FACILITY_ICONS } from "../../utils/IconData";
import Snackbar from "../../components/form/Snackbar";
import SearchHotelCard from "../../components/SearchHotelCard/SearchHotelCard";

export default function SearchPage() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hotel, setHotel] = useState<HotelSearch[] | null>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>();
  const [minPrice, setMinPrice] = useState<number>();

  const handleStarChange = (event: any) => {
    const selectedNumber = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedStars([...selectedStars, selectedNumber]);
    } else {
      setSelectedStars(selectedStars.filter((id) => id !== selectedNumber));
    }
  };
  const handleFacilityChange = (event: any) => {
    const selectedNumber = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedFacility([...selectedFacility, selectedNumber]);
    } else {
      setSelectedFacility(selectedFacility.filter((id) => id !== selectedNumber));
    }
  };

  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  useEffect(() => {
    getAllData(
      "/facilities",
      setLoading,
      setAllFacilities,
      showSnackbar,
      "facilities"
    );
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term") || "";
    setSearchTerm(term);
    if (term) {
      fetchSearchResults(term);
    }
  }, [location.search]);

  const fetchSearchResults = async (term: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/hotel/search`,
        {
          params: { term },
        }
      );
      setHotel(response.data)
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className={style.body}>
      <Navbar />
      <div className={style.container}>
        <div className={style.filter}>
          <div className={style.filterContainer}>
            <h5>Star rating</h5>
            <div className={style.starRatingList}>
              {[...Array(5).keys()].map((index) => {
                const starValue = index + 1;
                return (
                  <div className={style.starOption} key={index}>
                    <Checkbox
                      value={starValue}
                      id={`star-${starValue}`}
                      onChange={(e: any) => handleStarChange(e)}
                    />
                    <label htmlFor={`star-${starValue}`}>
                      <Star star={starValue} />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={style.filterContainer}>
            <h5 style={{ marginBottom: "1.5vh" }}>Price Range</h5>
            <PriceRangeSlider
              maxDefaultValue={10000000}
              minDefaultValue={0}
              setMaxValue={setMaxPrice}
              setMinValue={setMinPrice}
            />
            <div style={{ height: "2vh" }}></div>
          </div>
          <div className={style.filterContainer}>
            <h5 style={{ marginBottom: "1.5vh" }}>Hotel Rating</h5>
            <div className={style.ratingContainer}></div>
          </div>
          <div className={style.filterContainer}>
            <h5 style={{ marginBottom: "1.5vh" }}>Facilities</h5>
            <div className={style.facilitiesFilterContainer}>
              {allFacilities.map((facility: Facility) => (
                <div className={style.facilityList} key={facility.facilityName}>
                  <Checkbox value={facility.ID} id={`facility-${facility.ID}`} onChange={handleFacilityChange}/> 
                  {
                    FACILITY_ICONS[
                      facility.facilityName as keyof typeof FACILITY_ICONS
                    ]
                  }
                  <label htmlFor={`facility-${facility.ID}`}>{facility.facilityName}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={style.facilityFilter}></div>
        </div>
        <div className={style.hotelList}>
          {
            hotel?.map((h : HotelSearch) => (
              <SearchHotelCard hotel={h}/>
            ))
          }
        </div>
      </div>
      <Snackbar
        message={snackbarMessage}
        type={snackbarType}
        show={snackbarOpen}
        setShow={setSnackbarOpen}
      />

      <Footer />
    </div>
  );
}
