import AdminPage from "../pages/Admin/AdminPage/AdminPage";
import InsertPromoPage from "../pages/Admin/InsertPromos/insert-promo-page";
import ManageHotelPage from "../pages/Admin/ManageHotel/manage-hotel-page";
import ManageUsers from "../pages/Admin/ManageUsers/ManageUsers";
import SendnewsLetter from "../pages/Admin/SendNewsletter/SendNewsletter";
import MyCards from "../pages/MyCardsPage/MyCards";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import CheckLocationPage from "../pages/check-location-page";
import GamePage from "../pages/game-page";
import HomePage from "../pages/home-page";
import LoginPage from "../pages/login-page";
import RegisterPage from "../pages/register-page";


export interface IMenu{
  name : string;
  path : string;
  element :JSX.Element;
}

export const MENU_LIST: IMenu[] = [
  {
    element:<LoginPage/>,
    name:"Login",
    path:"/login"
  },
  {
    element:<RegisterPage/>,
    name:"Sign Up",
    path:"/signup"
  },
  {
    element:<HomePage/>,
    name:"Home",
    path:"/"
  },
  {
    element:<GamePage/>,
    name:"Game",
    path:"/game"
  },
  {
    element:<CheckLocationPage/>,
    name:"Check Location",
    path:"/check-location"
  },
  {
    element:<ProfilePage/>,
    name:"Personal Information",
    path:"/personal-information"
  },
  {
    element:<MyCards/>,
    name:"My Cards",
    path:"/my-cards"
  },
  {
    element:<AdminPage/>,
    name:"Admin Page",
    path:"/admin"
  },
  {
    element:<SendnewsLetter/>,
    name:"Send Newsletter",
    path:"/admin/send-newsletter"
  },
  {
    element:<ManageUsers/>,
    name:"Manager Users",
    path:"/admin/manage-users"
  },
  {
    element:<ManageHotelPage/>,
    name:"Manager Hotels",
    path:"/admin/manage-hotels"
  },
  {
    element:<InsertPromoPage/>,
    name:"Insert Promos",
    path:"/admin/insert-promos"
  },
]