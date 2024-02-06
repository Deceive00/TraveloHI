import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MENU_LIST, IMenu } from "./settings/menu-settings"
import "./style/global.scss"
import "./style/index.css"
import MainTemplate from "./templates/main-template"
import { UserProvider } from "./context/UserContext"
import { ThemeProvider } from "./context/ThemeContext"

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <MainTemplate>
            <Routes >
              { 
                MENU_LIST.map((menu: IMenu, index: number) => 
                  <Route element={menu.element} path={menu.path} key={index}/>
              )}
              {
                <Route
                  path="/"
                  element={<Navigate to="/" replace />}

                />
              }
            </Routes>
          </MainTemplate>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
