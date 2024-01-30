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
    path:"/home"
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
]