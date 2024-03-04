
import Navbar from "../components/navigationbar/Navbar";
import style from "../style/homepage.module.scss";
import Footer from "../components/footer/Footer";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PromotionCard from "../components/home-page/PromotionCard/PromotionCard";
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import SearchComponent from "../components/home-page/SearchComponent/SearchComponent";
import { TRAVEL_WITH_TRAVELOHI_REASONS } from "../utils/Items";
import ReasonCard from "../components/ReasonCard/ReasonCard";
import HotelRecommendationHome from "../components/home-page/HotelRecommendationHome/HotelRecommendationHome";
import FlightRecommendationHome from "../components/Flight/FlightRecommendationHome/FlightRecommendationHome";
export default function HomePage() {
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number | undefined>(0);
  const ws = useRef<WebSocket | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const getPromotion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/get-all-promotions",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPromotions(response.data.promotions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPromotion();
    const intervalId = setInterval(() => {
      getPromotion();
    }, 500); 

    return () => clearInterval(intervalId);
  }, []);

  const handleNextPromotion = () => {
    const divElement = sliderRef.current;
    if (divElement) {
      let newPosition
      if(window.innerWidth > 768){
        newPosition = divElement.scrollLeft + divElement.offsetWidth / 2;
      }else{
        newPosition = divElement.scrollLeft + divElement.offsetWidth;
      }
      divElement.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  const handlePrevPosition = () => {
    const divElement = sliderRef.current;
    if (divElement) {
      let newPosition;
      if(window.innerWidth > 768){
        newPosition = divElement.scrollLeft - divElement.offsetWidth / 2;
      }else{
        newPosition = divElement.scrollLeft - divElement.offsetWidth;
      }
      divElement.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  return (
    <>
      <Navbar />
      <div className={style.topBackground}></div>
      <div className={style.homeContainer}>
        <div className={style.searchComponentContainer}>
          <div style={{width: '90%'}}>
            <SearchComponent/>
          </div>
        </div>
        {promotions.length !== 0 && (
          <div className={style.promotionContainer}>
            <h2>Exclusive Deals Just For You!</h2>
            <div className={style.sliderWrapper}>
              <div className={style.promotionSlider} ref={sliderRef}>
                {promotions.map((promotion, index) => (
                  <PromotionCard key={`${promotion.promotionName} ${index}`} promotion={promotion} />
                ))}
              </div>
              {scrollPosition !== 0 && (
                <button
                  onClick={handlePrevPosition}
                  className={`${style.promotionButton} ${style.prevPromotion}`}
                >
                  <IoChevronBack/>
                </button>
              )}
              {scrollPosition !== sliderRef.current?.scrollWidth && (
                <button
                  onClick={handleNextPromotion}
                  className={`${style.promotionButton} ${style.nextPromotion}`}
                >
                  <IoChevronForward/>
                </button>
              )}
            </div>
          </div>
        )}
        <div className={style.hotelRecommendationHomeContainer}>
          <h2>Top Recommendation Hotel In Worldwide</h2>
          <div className={style.hotelRecommendationSlider}>
            <HotelRecommendationHome/>
          </div>
        </div>
        <div className={style.hotelRecommendationHomeContainer}>
          <h2>Get your flight tickets</h2>
          <div className={style.hotelRecommendationSlider}>
            <FlightRecommendationHome/>
          </div>
        </div>
        <div className={style.reasonContainer}>
          <h2>Why Travel With Traveloka?</h2>
          <div className={style.reasons}>
            {
              TRAVEL_WITH_TRAVELOHI_REASONS.map((reason : IReason, index : number) => (
                <ReasonCard reason={reason} key={index}/>
              ))
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
