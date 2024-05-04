import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Login from "./components/Login/login"
// import MainPage from "./components/main/mainPage"
import PageNotFound from "./components/NotFoundPage/pageNotFound"
import TemplatePage from "./components/template";
import JoySignInSideTemplate from "./components/Login/loginTest";
import JoyOrderDashboardTemplate from "./components/main/MainPage";
function Router() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<TemplatePage />}>
               <Route path="login" element={<JoySignInSideTemplate />} />
               <Route path="main" element={<JoyOrderDashboardTemplate />} />
            </Route>
            <Route element={<PageNotFound />} path="*" />
         </Routes>
      </BrowserRouter>
   );
}

export default Router