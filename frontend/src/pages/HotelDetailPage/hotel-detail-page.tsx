import { useParams } from "react-router-dom";
import style from "./hotel-detail-page.module.scss";
import MainTemplate from "../../templates/main-template";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Snackbar from "../../components/form/Snackbar";

export default function HotelDetailPage() {
  let { hotelId } = useParams();
  const [hotel, setHotel] = useState<Hotel>();
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
          console.log(response.data)
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
            showSnackbar(responseData.error as string, 'error')
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
        <div>
          <div className={style.imageContainer}>
            
          </div>
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
