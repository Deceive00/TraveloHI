
import Navbar from "../components/navigationbar/Navbar";
import style from "../style/homepage.module.scss";
import Footer from "../components/footer/Footer";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PromotionCard from "../components/PromotionCard/PromotionCard";
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
export default function HomePage() {
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number | undefined>(0);

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
        console.log(response.data.promotions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPromotion();
  }, []);

  const handleNextPromotion = () => {
    const divElement = sliderRef.current;
    if (divElement) {
      const newPosition = divElement.scrollLeft + divElement.offsetWidth / 2;
      divElement.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  const handlePrevPosition = () => {
    const divElement = sliderRef.current;
    if (divElement) {
      const newPosition = divElement.scrollLeft - divElement.offsetWidth / 2;
      divElement.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  return (
    <>
      <Navbar />
      <div className={style.topBackground}></div>
      <div className={style.homeContainer}>
        {promotions.length !== 0 && (
          <div className={style.promotionContainer}>
            <h2>Exclusive Deals Just For You!</h2>
            <div className={style.sliderWrapper}>
              <div className={style.promotionSlider} ref={sliderRef}>
                {promotions.map((promotion) => (
                  <PromotionCard promotion={promotion} />
                ))}
              </div>
              <button onClick={handlePrevPosition}>previous</button>
              <button onClick={handleNextPromotion}>next</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
