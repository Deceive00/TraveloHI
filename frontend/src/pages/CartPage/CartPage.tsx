import { useEffect, useState } from "react";
import Middleware from "../../components/auth/Middleware";
import Footer from "../../components/footer/Footer";
import MainTemplate from "../../templates/main-template";
import style from "./CartPage.module.scss";
import {
  getAllData,
  getTotalDays,
  insertData,
  updateData,
} from "../../utils/utils";
import { useCurrency } from "../../context/CurrencyContext";
import HotelCartCard from "../../components/Cart/HotelCartCard/HotelCartCard";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/form/Textfield";
import Snackbar from "../../components/form/Snackbar";
import FlightCartCard from "../../components/Cart/FlightCartCard/FlightCartCard";
import { useUser } from "../../context/UserContext";
import { CiCreditCard2 } from "react-icons/ci";
import { isArray, round } from "lodash";
import { BiWallet } from "react-icons/bi";
import axios, { AxiosError } from "axios";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";

interface IProduct {
  flightCarts: IFlightCarts[];
  hotelCarts: IHotelCarts[];
}

enum CheckoutStep {
  CART = "Cart",
  PAYMENT = "Payment",
  SUCCESS = "Success",
}
enum PaymentMethod {
  CARD,
  WALLET,
}
export default function CartPage() {
  const [cart, setCart] = useState<IProduct>();
  const { getCurrency, convertPrice } = useCurrency();
  const [isHotelFormOpen, setIsHotelFormOpen] = useState(false);
  const [hotelCartUpdateData, setHotelCartUpdateData] = useState<IHotelCarts>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.WALLET);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(
    CheckoutStep.CART
  );
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  const [selectedPayment, setSelectedPayment] = useState("hi-wallet");
  const [creditCard, setCreditCard] = useState<ICreditCard[]>([]);
  const [promoError, setPromoError] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [promotionPercentage, setPromotionPercentage] = useState(0);
  const [promoId, setPromoId] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  useEffect(() => {
    getAllData("/cart", setCart);
  }, []);
  const getTotalFlightPrice = () => {
    let total = 0;
    let len = cart?.flightCarts?.length || 1;
    if (!cart?.flightCarts || cart.flightCarts?.length <= 0) return;
    for (let i = 0; i < len; i++) {
      console.log(cart?.flightCarts[i]?.Tickets[0]?.Seat)
      total += (cart?.flightCarts[i]?.Tickets[0]?.Flight?.flightPrice || 1) * cart?.flightCarts[i]?.Tickets[0]?.Seat?.SeatClass?.multiplier;
    }
    return total;
  };
  console.log(cart)
  const getAddOnBaggage = () => {
    let total = 0;
    let len = cart?.flightCarts?.length || 1;
    if (!cart?.flightCarts || cart.flightCarts.length <= 0) return;
    for (let i = 0; i < len; i++) {
      total += (cart?.flightCarts[i]?.Tickets[0]?.addOnBaggageWeight || 1) * 10;
    }
    return convertPrice(total);
  };

  const getHotelTotalPrice = () => {
    let total = 0;
    let len = cart?.hotelCarts?.length || 1;
    if (!cart?.hotelCarts || cart.hotelCarts.length <= 0) return;
    for (let i = 0; i < len; i++) {
      total +=
        (cart?.hotelCarts[i]?.Room?.roomPrice || 1) *
        (cart?.hotelCarts[i]?.totalRooms || 1) *
        getTotalDays(
          cart?.hotelCarts[i]?.checkInDate || "",
          cart?.hotelCarts[i]?.checkOutDate || ""
        );
    }
    return convertPrice(total);
  };

  const getTotalPrice = () => {
    return (
      (getHotelTotalPrice() || 0) +
      (getAddOnBaggage() || 0) +
      (getTotalFlightPrice() || 0)
    );
  };
  const handleEditHotel = (hotel: IHotelCarts) => {
    setHotelCartUpdateData(hotel);
    setIsHotelFormOpen(true);
  };
  const { user } = useUser();
  const handleCheckout = () => {
    console.log(cart?.flightCarts?.length, cart?.hotelCarts?.length);
    if (
      cart?.flightCarts ||
      cart?.flightCarts ||
      (cart?.hotelCarts?.length || 0) > 0 ||
      (cart?.flightCarts?.length || 0) > 0
    )
      setCurrentStep(CheckoutStep.PAYMENT);
  };
  const handlePayment = async () => {
    let stringifiedData;
    const ticketIds: number[] = [];
    const hotelCartIds: number[] = [];
    let url;
    cart?.flightCarts?.forEach((cartItem) => {
      cartItem.Tickets.forEach((ticket) => {
        ticketIds.push(parseInt(ticket.ID));
      });
    });

    cart?.hotelCarts?.forEach((cartItem) => {
      hotelCartIds.push(parseInt(cartItem.ID));
    });

    if (selectedPaymentMethod === PaymentMethod.WALLET) {
      stringifiedData = JSON.stringify({
        price: getTotalPrice() - (promotionPercentage / 100) * getTotalPrice(),
        ticketIds: ticketIds,
        hotelCartIds: hotelCartIds,
        promotionId: promoId,
      });
      url = "/cart/wallet";
    } else {
      stringifiedData = JSON.stringify({
        price: getTotalPrice() - (promotionPercentage / 100) * getTotalPrice(),
        ticketIds: ticketIds,
        cardId: parseInt(selectedPayment.split("-")[1]),
        hotelCartIds: hotelCartIds,
        promotionId: promoId,
      });
      url = "/cart/card";
    }

    try {
      await insertData(
        `${url}`,
        stringifiedData,
        setLoading,
        showSnackbar,
        () => setCurrentStep(CheckoutStep.SUCCESS)
      );
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
          console.error(responseData.error);
        }
      }
    }
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
  useEffect(() => {
    getAllData(
      "/get-credit-card",
      setCreditCard,
      setLoading,
      showSnackbar,
      "creditCards"
    );
  }, []);
  const handleCheckPromotion = async () => {
    if (promotionCode === "") {
      setPromoError("Please enter promotion code");
    } else {
      setPromoError("");
    }

    try {
      const stringifiedData = JSON.stringify({
        promotionCode: promotionCode,
      });
      const response = await axios.post(
        "http://localhost:8080/api/promotion/verify",
        stringifiedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        showSnackbar(response.data.message, "success");
        setPromoId(response.data.id);
        setPromotionPercentage(response.data.promotionPercentage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        if (
          typeof responseData === "object" &&
          responseData !== null &&
          "error" in responseData
        ) {
          setPromoError(responseData.error as string);
          console.error(responseData.error);
        }
      }
    }
  };
  return (
    <MainTemplate>
      <Middleware>
        <>
          {loading && <Loading />}
          <div className={style.cartPageContainer}>
            <h1>
              {currentStep === CheckoutStep.CART
                ? "Cart"
                : currentStep === CheckoutStep.PAYMENT
                ? "Payment"
                : currentStep === CheckoutStep.SUCCESS
                ? "Success"
                : ""}
            </h1>
            <div className={style.progressBar}>
              <div
                className={`${style.progressSegment} ${
                  currentStep === CheckoutStep.CART ? style.active : ""
                }`}
              >
                Cart
              </div>
              <div
                className={`${style.progressSegment} ${
                  currentStep === CheckoutStep.PAYMENT ? style.active : ""
                }`}
              >
                Payment
              </div>
              <div
                className={`${style.progressSegment} ${
                  currentStep === CheckoutStep.SUCCESS ? style.active : ""
                }`}
              >
                Success
              </div>
            </div>
            <div className={style.cartPageContent}>
              {currentStep === CheckoutStep.SUCCESS && (
                <div>
                  <h2>Succesfully paid</h2>
                  <button className={style.updateButton} onClick={() => navigate('/history')}>Go To History</button>
                </div>
              )}
              {currentStep !== CheckoutStep.SUCCESS && (
                <div className={style.cartDetail}>
                  {currentStep === CheckoutStep.CART && (
                    <>
                      <div className={style.hotelDetailContainer}>

                        {(cart?.hotelCarts.length || 0) > 0 && (
                          <>
                            <h3 style={{ marginBottom: "1vh" }}>Hotels</h3>
                            <hr />
                            <div className={style.hotelListContainer}>
                              {(cart?.hotelCarts.length || 0) <= 0 && (
                                <h2>There are no hotels in the cart!</h2>
                              )}
                              {(cart?.hotelCarts.length || 0) > 0 &&
                                cart?.hotelCarts.map((hotel: IHotelCarts) => {
                                  return (
                                    <HotelCartCard
                                      hotelCart={hotel}
                                      key={hotel.ID}
                                      handleEdit={handleEditHotel}
                                    />
                                  );
                                })}
                            </div>
                          </>
                        )}
                      </div>
                      {(cart?.flightCarts?.length || 0) > 0 && (
                        <div className={style.flightDetailContainer}>
                          <h3 style={{ marginBottom: "1vh" }}>Flights</h3>
                          <hr />
                          <div className={style.hotelListContainer}>
                            {(cart?.flightCarts?.length || 0) <= 0 && (
                              <h2>There are no flights in the cart!</h2>
                            )}
                            {cart?.flightCarts &&
                              cart?.flightCarts?.map((flight: IFlightCarts) => {
                                return <FlightCartCard flightCart={flight} />;
                              })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {currentStep === CheckoutStep.PAYMENT && (
                    <>
                      <div className={style.paymentMethod}>
                        <h3>Choose Your Payment Method</h3>
                        <div className={style.paymentMethodContainer}>
                          <div
                            className={`${style.paymentCard} ${
                              selectedPayment === `hi-wallet`
                                ? style.activeCard
                                : ""
                            }`}
                            key={"hi-wallet"}
                            onClick={() => {
                              setSelectedPayment(`hi-wallet`);
                              setSelectedPaymentMethod(PaymentMethod.WALLET);
                            }}
                          >
                            <div className={style.imageCardContainer}>
                              <BiWallet />
                            </div>
                            <p>Pay With Hi-Wallet</p>
                            <p>
                              Balance: {getCurrency()}
                              {convertPrice(user?.walletCredits || 1)}
                            </p>
                            <div className={style.cardCircle}>
                              <div className={style.cardCircleFill}></div>
                            </div>
                          </div>
                          {isArray(creditCard) &&
                            creditCard?.map((cc: ICreditCard) => {
                              return (
                                <div
                                  className={`${style.paymentCard} ${
                                    selectedPayment === `card-${cc.id}`
                                      ? style.activeCard
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedPayment(`card-${cc.id}`);
                                    setSelectedPaymentMethod(
                                      PaymentMethod.CARD
                                    );
                                  }}
                                  key={`card-${cc.id}`}
                                >
                                  <div className={style.imageCardContainer}>
                                    <CiCreditCard2 />
                                  </div>
                                  <p>
                                    {cc.bankName} - {cc.accountName}
                                  </p>
                                  <div className={style.cardCircle}>
                                    <div className={style.cardCircleFill}></div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className={style.promotion}>
                        <div className={style.promotionCodeContainer}>
                          <div
                            className={`input-group ${style.promotionInput}`}
                          >
                            <label htmlFor={"promotion-code"}>
                              Promotion Code
                            </label>
                            <input
                              type={"text"}
                              id={"promotion-code"}
                              name={"promotion-code"}
                              onChange={(e) => setPromotionCode(e.target.value)}
                              className={`form-input ${
                                promoError !== "" ? "error" : ""
                              }`}
                              placeholder={"Promotion Code "}
                            />
                            {promoError !== "" && (
                              <div className="error-message">{promoError}</div>
                            )}
                            <button
                              className={style.promotionButton}
                              onClick={handleCheckPromotion}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {currentStep !== CheckoutStep.SUCCESS && (
                <div className={style.priceSection}>
                  <div className={style.priceContainer}>
                    <div className={style.priceContent}>
                      <h3>Summary</h3>
                      <hr />
                      <div className={style.price}>
                        <h4>Hotel Rooms</h4>
                        <h4 className={style.actualPrice}>
                          {getCurrency()}
                          {getHotelTotalPrice() || 0}
                        </h4>
                      </div>
                      <div className={style.price}>
                        <h4>Flight Tickets</h4>
                        <h4 className={style.actualPrice}>
                          {getCurrency()}
                          {convertPrice(getTotalFlightPrice() || 0) || 0}
                        </h4>
                      </div>
                      <div className={style.price}>
                        <h4>Add On Baggage</h4>
                        <h4 className={style.actualPrice}>
                          {getCurrency()}
                          {getAddOnBaggage() || 0}
                        </h4>
                      </div>
                      {promotionPercentage !== 0 && (
                        <div className={style.price}>
                          <h4>Discount</h4>
                          <h4 className={style.actualPrice}>
                            - {getCurrency()}
                            {round(
                              convertPrice(
                                (promotionPercentage / 100) * getTotalPrice()
                              ),
                              2
                            ) || 0}
                          </h4>
                        </div>
                      )}
                      <hr />
                      <div className={style.price}>
                        <h3>Grand Total</h3>
                        <h3 className={style.actualPrice}>
                          {getCurrency()}
                          {getTotalPrice() -
                            (promotionPercentage / 100) * getTotalPrice()}
                        </h3>
                      </div>
                      {currentStep === CheckoutStep.CART && (
                        <button
                          className={style.checkoutButton}
                          onClick={handleCheckout}
                          disabled={
                            (cart?.hotelCarts?.length || 0) <= 0 &&
                            (cart?.flightCarts?.length || 0) <= 0
                          }
                        >
                          Checkout
                        </button>
                      )}
                      {currentStep === CheckoutStep.PAYMENT && (
                        <button
                          className={style.checkoutButton}
                          onClick={handlePayment}
                        >
                          Confirm Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
