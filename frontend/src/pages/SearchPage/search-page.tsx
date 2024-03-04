import axios, { AxiosError } from "axios";
import Navbar from "../../components/navigationbar/Navbar";
import style from "./search-page.module.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import { getMinimumPrice } from "../../utils/utils";
import Star from "../../components/Star/Star";
import Checkbox from "../../components/form/Checkbox/Checkbox";
import PriceRangeSlider from "../../components/PriceSlider/PriceRangeSlider";
import { FACILITY_ICONS } from "../../utils/IconData";
import Snackbar from "../../components/form/Snackbar";
import SearchHotelCard from "../../components/SearchHotelCard/SearchHotelCard";
import Loading from "../../components/Loading/Loading";
import SearchComponent from "../../components/home-page/SearchComponent/SearchComponent";
import { useUser } from "../../context/UserContext";
import { useCurrency } from "../../context/CurrencyContext";

const ratingOptions = [
  { value: 0, label: "All ratings" },
  { value: 4.5, label: "4.5+" },
  { value: 4, label: "4+" },
  { value: 3, label: "3+" },
];

export default function SearchPage() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hotel, setHotel] = useState<HotelSearch[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>();
  const [minPrice, setMinPrice] = useState<number>();
  const [selectedRatings, setSelectedRatings] = useState<number[]>([0]);
  const [filteredHotels, setFilteredHotels] = useState<HotelSearch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const {currency, convertPrice} = useCurrency();
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rating = parseFloat(event.target.value);
    if (!isNaN(rating)) {
      if (selectedRatings.includes(rating)) {
        setSelectedRatings(selectedRatings.filter((r) => r !== rating));
      } else {
        setSelectedRatings([...selectedRatings, rating]);
      }
    }
  };

  const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedNumber = parseInt(event.target.value, 10);
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
      setSelectedFacility(
        selectedFacility.filter((id) => id !== selectedNumber)
      );
    }
  };

  useEffect(() => {
    const selectedRatingSorted = selectedRatings.sort((a, b) => a - b);
    const filterHotels = (hotel: HotelSearch) => {
      if (
        selectedStars.length > 0 &&
        !selectedStars.includes(hotel.hotelStar)
      ) {
        console.log(selectedStars);
        console.log(hotel.hotelStar);
        return false;
      }

      if (selectedFacility.length > 0) {
        const hotelFacilities = hotel.facilities.map((facility) =>
          facility.ID.toString()
        );
        if (
          !selectedFacility.every((facility) =>
            hotelFacilities.includes(facility.toString())
          )
        ) {
          console.log("facility ga memumpuni");
          return false;
        }
      }
      console.log(convertPrice(getMinimumPrice(hotel.rooms)))
      if (
        (minPrice !== undefined &&
          minPrice &&
          convertPrice(getMinimumPrice(hotel.rooms)) <= minPrice) ||
        (maxPrice !== undefined &&
          maxPrice &&
          convertPrice(getMinimumPrice(hotel.rooms)) >= maxPrice)
      ) {
        return false;
      }

      if (
        selectedRatingSorted.length > 0 &&
        hotel.overallRating < selectedRatingSorted[0]
      ) {
        return false;
      }

      return true;
    };

    const filteredData = hotel?.filter(filterHotels);
    setFilteredHotels(filteredData);
  }, [
    hotel,
    selectedFacility,
    selectedStars,
    maxPrice,
    minPrice,
    selectedRatings,
    currency
  ]);

  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(parseInt(event.target.value));
  };
  useEffect(() => {
    // getAllData(
    //   "/facilities",
    //   setLoading,
    //   setAllFacilities,
    //   showSnackbar,
    // );
    const fetchFacility = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/facilities`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAllFacilities(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const responseData = axiosError.response?.data;
          if (typeof responseData === 'object' && responseData !== null && 'error' in responseData) {
              console.error('Answer is not valid details:', responseData.error);
              showSnackbar(responseData.error as string, 'error');
          }
        }
      }
    };
    fetchFacility();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term") || "";
    setSearchTerm(term);
    if (term) {
      fetchSearchResults(term);
    }
  }, [location.search]);
  
  const {user} = useUser();
  const fetchSearchResults = async (term: string) => {
    try {
      if(term === '') return;
      const response = await axios.get(
        `http://localhost:8080/api/hotel/search`,
        {
          params: { term: term, page: currentPage, pageSize: pageSize, userId: user?.id },
        }
      );
      setHotel(response.data.hotels);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchSearchResults(searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  return (
    <div className={style.body}>
      {loading && <Loading />}
      <Navbar />

      <div className={style.container}>
        <SearchComponent defaultValue={searchTerm} />
        <h2 style={{textAlign:'left', width:'100%', fontSize:'calc(13px + 0.4vw)'}}>Displaying Results for {searchTerm}</h2>
        <div className={style.content}>
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
                maxDefaultValue={1000}
                minDefaultValue={1}
                setMaxValue={setMaxPrice}
                setMinValue={setMinPrice}
              />
              <div style={{ height: "2vh" }}></div>
            </div>
            <div className={style.filterContainer}>
              <h5 style={{ marginBottom: "1.5vh" }}>Hotel Rating</h5>
              <div className={style.ratingContainer}>
                {ratingOptions.map((option) => (
                  <div className={style.ratingOption} key={option.value}>
                    <Checkbox
                      value={option.value}
                      id={`rating-${option.value}`}
                      checked={selectedRatings.includes(option.value)}
                      onChange={handleRatingChange}
                    />
                    <label
                      className={style.ratingLabel}
                      htmlFor={`rating-${option.value}`}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className={style.filterContainer}>
              <h5 style={{ marginBottom: "1.5vh" }}>Facilities</h5>
              <div className={style.facilitiesFilterContainer}>
                {allFacilities && allFacilities?.map((facility: Facility) => (
                  <div
                    className={style.facilityList}
                    key={facility.facilityName}
                  >
                    <Checkbox
                      value={facility.ID}
                      id={`facility-${facility.ID}`}
                      onChange={handleFacilityChange}
                    />
                    {
                      FACILITY_ICONS[
                        facility.facilityName as keyof typeof FACILITY_ICONS
                      ]
                    }
                    <label htmlFor={`facility-${facility.ID}`}>
                      {facility.facilityName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className={style.facilityFilter}></div>
          </div>
          <div className={style.hotelList}>
            {(!filteredHotels || filteredHotels.length <= 0) && (
              <h2 style={{ width: "100%" }}>No Hotels Match</h2>
            )}
            {filteredHotels?.length > 0 &&
              filteredHotels?.map((h: HotelSearch, index: number) => {
                return <SearchHotelCard hotel={h} key={index} />;
              })}
          </div>
        </div>
        <div className={style.pagination}>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              className={style.paginationButton}
            >
              {index + 1}
            </button>
          ))}
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
