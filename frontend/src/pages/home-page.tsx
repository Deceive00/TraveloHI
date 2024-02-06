
import { useUser } from "../context/UserContext";
import Navbar from "../components/navigationbar/Navbar";
import style from "../style/homepage.module.scss"; 
import Footer from "../components/footer/Footer";
import Middleware from "../components/auth/Middleware";

export default function HomePage() {
  const { user } = useUser();

  return (
    <>
   
      <Navbar />
      <div className={style.topBackground}>
      </div>
      <div className={style.homeContainer}>
      </div>
      <Footer/>

    </>
  );
}
