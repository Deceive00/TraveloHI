import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import SettingSidebar from "../../components/SettingSidebar/SettingSidebar";
import Middleware from "../../components/auth/Middleware";
import Footer from "../../components/footer/Footer";
import Snackbar from "../../components/form/Snackbar";
import Navbar from "../../components/navigationbar/Navbar";
import style from "./MyCards.module.scss";
import commonStyle from "../ProfilePage/profilepage.module.scss";
import CardIcon from "/images/credit-card.png";
import AddCardModal from "../../components/Card/AddCardModal";
import axios from "axios";
import CreditCardList from "../../components/Card/CreditCardList/CreditCardList";

export default function MyCards() {
  const [loading, setLoading] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openAddCard, setOpenAddCard] = useState(false);
  useEffect(() => {
    fetchCreditCardData();
  }, []);

  const fetchCreditCardData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/get-credit-card",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await response.data;
      if (response.status === 200) {
        setCreditCards(data.creditCards);
      } else {
        setSnackbarMessage("Error fetching credit card data");
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching credit card data:", error);
      setSnackbarMessage("Error fetching credit card data");
      setSnackbarType("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
    console.log("muncul ga si");
  };
  const handleOpenAddCard = () => {
    setOpenAddCard(true);
  };

  const handleCloseAddCard = () => {
    setOpenAddCard(false);
  };
  const handleDelete = async (cardID: any) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/delete-credit-card/${cardID}`,
        {
          withCredentials: true,
        }
      );
      const data = await response.data;
      console.log(data);
      if (response.status === 200) {
        setSnackbarMessage(data.message);
        setSnackbarType("success");
        setSnackbarOpen(true);
        setCreditCards(data.remainingCreditCards);
      } else {
        setSnackbarMessage(data.error);
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching credit card data:", error);
      setSnackbarMessage("Error fetching credit card data");
      setSnackbarType("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Middleware>
      <Navbar />
      <div className={commonStyle.profilePageContent}>
        {loading && <Loading />}
        {!loading && (
          <div className={commonStyle.profilePageContainer}>
            <SettingSidebar />
            <div className={style.rightCardsPageContainer}>
              <div className={style.rightCardsPage}>
                <div className={commonStyle.pageTitleContainer}>
                  <div className={style.titleContainer}>
                    <div className={style.leftTitleContainer}>
                      <div className={commonStyle.circularContainer}>
                        <img src={CardIcon} alt="shield" />
                      </div>
                      <div className={commonStyle.pageTextTitleContainer}>
                        <h1>My Cards</h1>
                        <p>You can save up to 3 Bank Accounts</p>
                      </div>
                    </div>
                    {/* <div className={style.cardButtonContainer}> */}
                      <button
                        className={style.addCardButton}
                        onClick={handleOpenAddCard}
                      >
                        Add Card
                      </button>
                    {/* </div> */}
                  </div>
                </div>
                {creditCards.length !== 0 && (
                  <div>
                    {creditCards.map((card: ICreditCard, index: number) => (
                      <CreditCardList
                        card={card}
                        onDelete={handleDelete}
                        key={index}
                      />
                    ))}
                  </div>
                )}
                {creditCards.length === 0 && (
                  <div className={style.noCreditCards}>
                    <img src="/images/empty-folder.png" alt="" />
                    <h1>You don't have any bank accounts registered</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <AddCardModal
        isOpen={openAddCard}
        onRequestClose={handleCloseAddCard}
        showSnackbar={showSnackbar}
        refetch={() => window.location.reload()}
      />
      <Snackbar
        message={snackbarMessage}
        type={snackbarType}
        show={snackbarOpen}
        setShow={setSnackbarOpen}
      />
      <Footer />
    </Middleware>
  );
}
