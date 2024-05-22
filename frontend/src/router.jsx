import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Login from "./components/Login/login"
// import MainPage from "./components/main/mainPage"
import PageNotFound from "./components/NotFoundPage/pageNotFound"
import TemplatePage from "./components/template";
import SignIn from "./components/Login/Login";
import JoyOrderDashboardTemplate from "./components/main/MainPage";
import SpravkiPage from "./components/testSpravki/testSpravki";
import BuildingEditor from "./components/testMap";
import AddRole from "./components/Roles/AddRole";
import RoleTable from "./components/Roles/ViewRole";
import OrderTable from "./components/OrderTable/OrderTable";
import MainPage from "./components/main/mainPage (старая функция проверки) ";
function Router() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<TemplatePage />}>
               <Route path="login" element={<SignIn />} />
               <Route path="main" element={<JoyOrderDashboardTemplate />} >
                  <Route index element={< OrderTable/>} />
                  <Route path="roles" element={< RoleTable/>} />
               </Route>
               <Route path="test" element={<MainPage />} />
            </Route>
            <Route element={<PageNotFound />} path="*" />
         </Routes>
      </BrowserRouter>
   );
}

export default Router