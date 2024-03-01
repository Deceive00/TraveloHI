import { useEffect, useState } from "react";
import Middleware from "../../components/auth/Middleware";
import Footer from "../../components/footer/Footer";
import MainTemplate from "../../templates/main-template";
import style from "./CartPage.module.scss";
import { getAllData, updateData } from "../../utils/utils";
import { useCurrency } from "../../context/CurrencyContext";
import HotelCartCard from "../../components/Cart/HotelCartCard/HotelCartCard";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/form/Textfield";
import Snackbar from "../../components/form/Snackbar";
interface IFlightCarts {
  flightId: number;
  Tickets: ITickets[];
}
interface ICart {
  flightCarts: IFlightCarts[];
  hotelCarts: IHotelCarts[];
}
export default function CartPage() {
  const [cart, setCart] = useState<ICart>();
  const { getCurrency, convertPrice } = useCurrency();
  const [isHotelFormOpen, setIsHotelFormOpen] = useState(false);
  const [hotelCartUpdateData, setHotelCartUpdateData] = useState<IHotelCarts>();
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  useEffect(() => {
    getAllData("/cart", setCart);
  }, []);
  const getTotalFlightPrice = () => {
    let total = 0;
    let len = cart?.flightCarts?.length || 1;
    for (let i = 0; i < len; i++) {
      total += cart?.flightCarts[i].Tickets[0].Flight.flightPrice || 1;
    }
    return total;
  };
  const getAddOnBaggage = () => {
    let total = 0;
    let len = cart?.flightCarts?.length || 1;
    for (let i = 0; i < len; i++) {
      total += cart?.flightCarts[i].Tickets[0].addOnBaggageWeight || 1;
    }
    return convertPrice(total);
  };

  const getHotelTotalPrice = () => {
    let total = 0;
    let len = cart?.hotelCarts?.length || 1;
    for (let i = 0; i < len; i++) {
      total +=
        (cart?.hotelCarts[i].Room.roomPrice || 1) *
        (cart?.hotelCarts[i].totalRooms || 1);
    }
    return convertPrice(total);
  };

  const getTotalPrice = () => {
    return getHotelTotalPrice() + getAddOnBaggage() + getTotalFlightPrice();
  };
  const handleEditHotel = (hotel: IHotelCarts) => {
    setHotelCartUpdateData(hotel);
    setIsHotelFormOpen(true);
  };

  const hotelSubmit = async (data: any) => {
    let id = parseInt(hotelCartUpdateData?.ID);
    console.log(id);
    await updateData(
      "/hotel/cart",
      JSON.stringify({
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        totalRooms: parseInt(data.totalRooms),
        id: id,
      }),
      setLoading,
      showSnackbar,
      setIsHotelFormOpen
    ).then(() => {
      getAllData("/cart", setCart);
    });
    reset();
  };

  return (
    <MainTemplate>
      <Middleware>
        <>
          <div className={style.cartPageContainer}>
            <h1>Cart</h1>
            <div className={style.cartPageContent}>
              <div className={style.cartDetail}>
                <div className={style.hotelDetailContainer}>
                  <h3 style={{ marginBottom: "1vh" }}>Hotels</h3>
                  <hr />
                  <div className={style.hotelListContainer}>
                    {cart?.hotelCarts.map((hotel: IHotelCarts) => {
                      return (
                        <HotelCartCard
                          hotelCart={hotel}
                          handleEdit={handleEditHotel}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className={style.flightDetailContainer}>
                  <h3 style={{ marginBottom: "1vh" }}>Flights</h3>
                  <hr />
                  <div className={style.hotelListContainer}>
                    {cart?.flightCarts.map((flight: IFlightCarts) => {
                      return (
                        <>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={style.priceSection}>
                <div className={style.priceContainer}>
                  <div className={style.priceContent}>
                    <h3>Summary</h3>
                    <hr />
                    <div className={style.price}>
                      <h4>Hotel Rooms</h4>
                      <h4 className={style.actualPrice}>
                        {getCurrency()}
                        {getHotelTotalPrice()}
                      </h4>
                    </div>
                    <div className={style.price}>
                      <h4>Flight Tickets</h4>
                      <h4 className={style.actualPrice}>
                        {getCurrency()}
                        {convertPrice(getTotalFlightPrice())}
                      </h4>
                    </div>
                    <div className={style.price}>
                      <h4>Add On Baggage</h4>
                      <h4 className={style.actualPrice}>
                        {getCurrency()}
                        {getAddOnBaggage()}
                      </h4>
                    </div>
                    <hr />
                    <div className={style.price}>
                      <h3>Grand Total</h3>
                      <h3 className={style.actualPrice}>
                        {getCurrency()}
                        {getTotalPrice()}
                      </h3>
                    </div>
                    <button className={style.checkoutButton}>Checkout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
          <Modal
            isOpen={isHotelFormOpen}
            onRequestClose={() => setIsHotelFormOpen(false)}
          >
            <form
              action=""
              className={style.hotelFormUpdate}
              onSubmit={handleSubmit(hotelSubmit)}
            >
              <h4>{hotelCartUpdateData?.Hotel.hotelName || "name"}</h4>
              <div>
                <TextField
                  error={errors.checkInDate}
                  label="Check-in date"
                  name="checkInDate"
                  register={register}
                  rules={{}}
                  type="date"
                  defaultValue={hotelCartUpdateData?.checkInDate}
                />
              </div>
              <div>
                <TextField
                  error={errors.checkOutDate}
                  label="Check-out date"
                  name="checkOutDate"
                  register={register}
                  rules={{}}
                  type="date"
                  defaultValue={hotelCartUpdateData?.checkOutDate}
                />
              </div>
              <div>
                <TextField
                  error={errors.totalRooms}
                  label="Total Rooms"
                  name="totalRooms"
                  register={register}
                  rules={{}}
                  type="number"
                  defaultValue={hotelCartUpdateData?.totalRooms}
                />
              </div>
              <button className={style.updateButton}>Update</button>
            </form>
          </Modal>
          <Snackbar
            message={snackbarMessage}
            type={snackbarType}
            show={snackbarOpen}
            setShow={setSnackbarOpen}
          />
        </>
      </Middleware>
    </MainTemplate>
  );
}
