import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import Snackbar from "../../components/form/Snackbar";
import MainTemplate from "../../templates/main-template";
import style from "./hotel-detail-page.module.scss";
import Star from "../../components/Star/Star";
import { FaCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { HOTEL_DETAIL_REASONS } from "../../utils/Items";
import HotelDetailReasonCard from "../../components/HotelDetail/HotelDetailReasonCard/HotelDetailReasonCard";
import { getAllData } from "../../utils/utils";
import ReviewCard from "../../components/HotelDetail/ReviewCard/ReviewCard";
import { FACILITY_ICONS } from "../../utils/IconData";
import { IoChevronDown } from "react-icons/io5";
import RoomDetail from "../../components/HotelDetail/RoomDetail/RoomDetail";
import Footer from "../../components/footer/Footer";

interface HotelDetailNavigationTab {
  name: string;
  sectionRef: React.RefObject<HTMLDivElement>;
  isActive: boolean;
}

export default function HotelDetailPage() {
  let { hotelId } = useParams();
  const [hotel, setHotel] = useState<Hotel>();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFixedNavigationTab, setIsFixedNavigationTab] = useState(false);
  const navigationTabRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [navigationTab, setNavigationTab] = useState<
    Array<HotelDetailNavigationTab>
  >([
    {
      name: "General Information",
      sectionRef: useRef<HTMLDivElement>(null),
      isActive: true,
    },
    {
      name: "Review",
      sectionRef: useRef<HTMLDivElement>(null),
      isActive: false,
    },
    {
      name: "Facilities",
      sectionRef: useRef<HTMLDivElement>(null),
      isActive: false,
    },
    {
      name: "About",
      sectionRef: useRef<HTMLDivElement>(null),
      isActive: false,
    },
    {
      name: "Rooms",
      sectionRef: useRef<HTMLDivElement>(null),
      isActive: false,
    },
  ]);
  const navbarHeight = !isFixedNavigationTab ? 220 : 180;
  const triggerFixedOptions = {
    root: null,
    rootMargin: `-90px 0px 0px 0px`,
    threshold: 0,
  };
  const triggerActiveOptions = {
    root: null,
    rootMargin: `-140px 0px 0px 0px`,
    threshold: 0.1,
  };
  const navigationTabFixedTrigger = useRef(null);
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/get-hotel-by-id/${hotelId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const hotelData = response.data;
          const hotelMapped: Hotel = {
            hotelId: hotelId,
            hotelName: hotelData.hotelName,
            hotelDescription: hotelData.hotelDescription,
            overallRating: hotelData.overallRating,
            cleanlinessRating: hotelData.cleanlinessRating,
            comfortnessRating: hotelData.comfortnessRating,
            locationRating: hotelData.locationRating,
            serviceRating: hotelData.serviceRating,
            hotelAddress: hotelData.hotelAddress,
            hotelImage: hotelData.hotelPicture,
            hotelStar: hotelData.hotelStar,
            city: hotelData.cityName,
            country: hotelData.countryName,
          };

          const hotelFacility: Facility[] = hotelData.facilities.map(
            (facility: any) => {
              return {
                ID: facility.id,
                facilityName: facility.facilityName,
              };
            }
          );
          const hotelRooms: Room[] = hotelData.rooms.map((room: Room) => {
            return {
              gotBreakfast: room.gotBreakfast,
              gotFreeWifi: room.gotFreeWifi,
              isRefundable: room.isRefundable,
              isReschedulable: room.isReschedulable,
              isSmoking: room.isSmoking,
              roomCapacity: room.roomCapacity,
              roomName: room.roomName,
              roomPrice: room.roomPrice,
              totalRoom: room.totalRoom,
              roomSize: room.roomSize,
              roomBed: room.roomBed,
              roomPicture: room.roomPicture
            };
          });

          setFacilities(hotelFacility);
          setHotel(hotelMapped);
          setRooms(hotelRooms);
        }

        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const responseData = axiosError.response?.data;
          if (
            typeof responseData === "object" &&
            responseData !== null &&
            "error" in responseData
          ) {
            showSnackbar(responseData.error as string, "error");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
    getAllData(
      `/hotels/reviews?hotelId=${hotelId}`,
      setLoading,
      setReviews,
      showSnackbar
    );

  }, [hotelId]);

  useEffect(() => {
    const callBackFunction = (entries: any) => {
      const [entry] = entries;
      setIsFixedNavigationTab(!entry.isIntersecting);
    };
    const observer = new IntersectionObserver(
      callBackFunction,
      triggerFixedOptions
    );
    if (navigationTabFixedTrigger.current) {
      observer.observe(navigationTabFixedTrigger.current);
    }

    return () => {
      if (navigationTabFixedTrigger.current) {
        observer.unobserve(navigationTabFixedTrigger.current);
      }
    };
  }, [navigationTabFixedTrigger, triggerFixedOptions]);

  useEffect(() => {
    const callBackFunction = (entries: IntersectionObserverEntry[]) => {
      const updatedTabs = [...navigationTab];
      if (navigationTabRef.current) {
        const threshold =
          window.innerHeight -
          navigationTabRef.current.getBoundingClientRect().top;
        if (
          threshold <
          navigationTabRef.current.getBoundingClientRect().top * 2.2
        ) {
          updatedTabs[0].isActive = true;
          setNavigationTab(updatedTabs);
          return;
        }
      }
      entries.forEach((entry) => {
        const index = updatedTabs.findIndex(
          (tab) => tab.sectionRef.current === entry.target
        );
        if (index !== -1) {
          const sectionHeight = entry.boundingClientRect.top;
          let threshold = window.innerHeight - sectionHeight * 3.5;
          if (index === 4) threshold = window.innerHeight - sectionHeight;
          let isAboveThreshold = entry.boundingClientRect.top < threshold;
          updatedTabs[index].isActive =
            isAboveThreshold && entry.isIntersecting;
        }
      });
      setNavigationTab(updatedTabs);
    };

    const observer = new IntersectionObserver(
      callBackFunction,
      triggerActiveOptions
    );
    navigationTab.forEach((tab) => {
      if (tab.sectionRef.current) {
        observer.observe(tab.sectionRef.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [navigationTab, triggerActiveOptions]);

  const scrollToSection = (index: number) => {
    const sectionRef = navigationTab[index].sectionRef.current;
    if (sectionRef) {
      const yOffset = -navbarHeight;
      const y =
        sectionRef.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  const getMinimumPrice = (rooms: Room[]) => {
    let minPrice = 9999999999999;
    rooms.forEach((room) => {
      if (room.roomPrice < minPrice) {
        minPrice = room.roomPrice;
      }
    });
    return minPrice;
  };
  const formattedRating = hotel?.overallRating.toFixed(1);
  return (
    <MainTemplate>
      <>
        <div className={style.hotelDetailContainer}>
          <div className={style.imageContainer} ref={navigationTabFixedTrigger}>
            <div className={style.mainImage}>
              <img src={hotel?.hotelImage[0]} alt="Main Image" />
            </div>
            <div className={style.additionalImages}>
              {hotel?.hotelImage &&
                hotel?.hotelImage.length > 1 &&
                hotel?.hotelImage
                  .slice(1, 7)
                  .map((image: string, index: number) => {
                    if (index === 5) {
                      return (
                        <div
                          className={style.seeAllHotelImageContainer}
                          key={index}
                        >
                          <img src={image} alt="Additional Image" />
                          <div className={style.seeAllHotelImageOverlay}>
                            <h5>See all images</h5>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        className={style.seeAllHotelImageContainer}
                        key={index}
                      >
                        <img src={image} alt="Additional Image" />
                      </div>
                    );
                  })}
            </div>
          </div>
          {isFixedNavigationTab && (
            <div style={{height:'5vh'}}></div>
          )}
          <div
            className={style.navigationTab}
            style={{
              position: isFixedNavigationTab ? "fixed" : "static",
              top: isFixedNavigationTab ? "8vh" :0,
              width: isFixedNavigationTab ? "80%" : "100%",
            }}
            ref={navigationTabRef}
          >
            {navigationTab.map(
              (navTab: HotelDetailNavigationTab, index: number) => (
                <div
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`${style.navigationTabOptions} ${
                    navTab.isActive ? style.activeTab : ""
                  }`}
                >
                  {navTab.name}
                </div>
              )
            )}
          </div>

          <div
            ref={navigationTab[0].sectionRef}
            className={`${style.generalInformation} `}
          >
            <div className={style.topGeneralInformation}>
              <div className={style.topLeftGeneralInformation}>
                <div className={style.typeAndStarContainer}>
                  <p>Hotel</p>
                  <Star star={hotel?.hotelStar} />
                </div>
                <h1>{hotel?.hotelName}</h1>
                <div className={style.locationAndRatingContainer}>
                  <div className={style.ratingContainer}>
                    <p>
                      {formattedRating}
                      <span>/5</span>
                    </p>
                    <span className={style.totalReview}>(907 review)</span>
                  </div>
                  <FaCircle />
                  <div className={style.locationContainer}>
                    <p>
                      {hotel?.city}, {hotel?.country}
                    </p>
                  </div>
                </div>
              </div>
              <div className={style.topRightGeneralInformation}>
                <p style={{ textAlign: "end" }}>Start from</p>
                <h5 className={style.hotelMinimumPrice}>
                  $ {getMinimumPrice(rooms)}
                </h5>
                <p style={{ textAlign: "end" }}>/room/night</p>
                <button className={style.seeRoomButton}>See Rooms</button>
              </div>
            </div>
            <div className={style.divider}></div>
            {!user && (
              <div className={style.centerGeneralInformation}>
                <div className={style.leftCenterGeneralInformation}>
                  <img
                    src="https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-mobile/si/2021/11/29/b807f185-5f5b-4b47-82b5-10e4ff4dea93-1638205121691-887385559298a6f5900c3008af12d977.png"
                    alt=""
                  />
                  <div>
                    <h5>Have you got an account?</h5>
                    <span>
                      Create one or log into it to enjoy member-only discounts &
                      benefits!
                    </span>
                  </div>
                </div>
                <div className={style.rightGeneralInformation}>
                  <button className={style.joinButton}>Join Now</button>
                </div>
              </div>
            )}
            <div className={style.divider}></div>
            <div className={style.bottomGeneralInformation}>
              <h2>The Fun Awaits</h2>
              <div className={style.hotelDetailReasonCardContainer}>
                {HOTEL_DETAIL_REASONS.map((reason: any) => {
                  return <HotelDetailReasonCard reason={reason} />;
                })}
              </div>
            </div>
          </div>
          <div className={style.divider}></div>
          <div ref={navigationTab[1].sectionRef} className={`${style.review}`}>
            <p className={style.sectionHeader}>Reviews</p>
            <div className={style.topRatingContainer}>
              <p className={style.overallRating}>
                {formattedRating}
                <span>/5</span>
              </p>
              <div className={style.reviewConclusion}>
                <h6>Fantastic</h6>
                <p>From 1000 review</p>
              </div>
            </div>
            <div className={style.bottomRatingContainer}>
              {
                !reviews && (
                  <div className={style.noReviewYet}>
                    <h1>No review yet</h1>
                  </div>
                )
              }
              {reviews?.length > 0 && reviews?.map((review) => {
 
                return <ReviewCard review={review} />;
              })}
            </div>
          </div>
          <div className={style.divider}></div>
          <div
            ref={navigationTab[2].sectionRef}
            className={`${style.facilities}`}
          
          >
            <p className={style.sectionHeader}>Facilities</p>
            <div className={style.facilityListContainer}>
              {
                facilities.map((facility : Facility) => {
                  return(
                    <div className={style.facilityList} key={facility.facilityName}>
                      {FACILITY_ICONS[facility.facilityName as keyof typeof FACILITY_ICONS]}
                      <p>{facility.facilityName}</p>
                    </div>
                  )
                })
              }
            </div>
            <span>See all <IoChevronDown/></span>
          </div>
          <div className={style.divider}></div>
          <div
            ref={navigationTab[3].sectionRef}
            className={`${style.about}`}
          >
            <p className={style.sectionHeader}>About {hotel?.hotelName}</p>
            <p className={style.hotelDescription}>{hotel?.hotelDescription}</p>
            <p className={style.seeMore}>See more <IoChevronDown/></p>
          </div>
          <div className={style.divider}></div>
          <div
            ref={navigationTab[4].sectionRef}
            className={`${style.rooms}`}
       
          >
            <p className={style.sectionHeader}>Room Type and Price</p>
            <div className={style.roomListContainer}>
              {
                rooms.map((room : Room, index: number) => (
                  <RoomDetail room={room} key={index}/>
                ))
              }
            </div>
          </div>
        </div>
        <Footer/>
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
