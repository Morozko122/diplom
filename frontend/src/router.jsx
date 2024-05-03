import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login/login"
import MainPage from "./components/main/mainPage"
import PageNotFound from "./components/pageNotFound"
import TemplatePage from "./components/template";
function Router() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<TemplatePage />}>
               <Route path="login" element={<Login />} />
               <Route path="main" element={<MainPage />} />
            </Route>
            <Route element={<PageNotFound />} path="*" />
         </Routes>
      </BrowserRouter>
   );
}

export default Router