import { useParams } from "react-router-dom";
import style from "./hotel-detail-page.module.scss";
import MainTemplate from "../../templates/main-template";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Snackbar from "../../components/form/Snackbar";

export default function HotelDetailPage() {
  let { hotelId } = useParams();
  const [hotel, setHotel] = useState<Hotel>();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
            hotelRating: hotelData.hotelRating,
            hotelPicture: hotelData.hotelPicture,
            hotelAddress: hotelData.hotelAddress,
            hotelImage: hotelData.hotelPicture,
            hotelStar: hotelData.hotelStar,
            city: hotelData.cityName,
            country: hotelData.countryName,
          }
          console.log(hotelData)
          const hotelFacility : Facility[] = hotelData.facilities.map((facility: any) => {
            return {
              id: facility.facilityId,
              name: facility.facilityName,
            };
          });

          const hotelRooms : Room[] = hotelData.rooms.map((room: Room) => {
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
  }, []);

  return (
    <MainTemplate>
      <>
        <div className={style.hotelDetailContainer}>
          <h1>Hotel Detail</h1>
          <div className={style.imageContainer}>
            <div className={style.mainImage}>
              <img src={hotel?.hotelImage[0]} alt="Main Image" />
            </div>
            <div className={style.additionalImages}>
              <img src={hotel?.hotelImage[1]} alt="Additional Image 1" />
              <img src={hotel?.hotelImage[2]} alt="Additional Image 2" />
            </div>
          </div>
          <p>{hotel?.hotelName}</p>
          <p>{hotel?.city}</p>
          <p>{hotel?.country}</p>
          <p>{hotel?.hotelAddress}</p>
          <p>{hotel?.hotelDescription}</p>
          <p>{hotel?.hotelRating}</p>
          <p>{hotel?.hotelStar}</p>
          <h1>Room</h1>
          {
            rooms.map((room : Room) => (
              <div>
                <p>{room.gotBreakfast} gotbreakfast</p>
                <p>{room.gotFreeWifi} .gotFreeWifi</p>
                <p>{room.isRefundable} .isRefundable</p>
                <p>{room.isReschedulable} .isReschedulable</p>
                <p>{room.isSmoking} .isSmoking</p>
                <p>{room.roomCapacity} .roomCapacity</p>
                <p>{room.roomName} .roomName</p>
                <p>{room.totalRoom} .totalRoom</p>
              </div>
            ))
          }
          <h1>Facility</h1>
          {
            facilities.map((facility : Facility) => (
              <div>
                {facility.id}
                {facility.name}
              </div>
            ))
          }
        </div>
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
