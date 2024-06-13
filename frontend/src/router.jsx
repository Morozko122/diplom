import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./components/NotFoundPage/pageNotFound";
import SignIn from "./components/Login/Login";
import JoyOrderDashboardTemplate from "./components/main/MainPage";
import UserTable from "./components/Users/ViewUsers";
import OrderTable from "./components/OrderTable/OrderTable";
import GroupTable from "./components/Group/ViewGroup";
import useToken from "./components/useToken/useToken";
import FileUpload from "./components/MapPage/mapPage";
import axios from 'axios';
import { API_BASE_URL } from "../config";
import Map from "./components/MapPage/test2";

const keys = [
  'access_token', 'user_role', 'user_id', 'email', 'full_name'
];

const checkToken = async (token, removeData) => {
  const headers = {
    headers:
    {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `application/json`
    }
  }
  try {
    await axios.get(`${API_BASE_URL}/check_token`, headers);
    return 200;
  }
  catch (e) {
    removeData();
    return e.response.status;
  }

};

function ProtectedRoute({ token, role, requiredRoles, removeData, children }) {
  checkToken(token, removeData);
  if (!token || token === "" || token === undefined) {
    return <Navigate to="/login" replace />;}
  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/pageNotFound" replace />;}
  return children;}
function Router() {
  const { data, removeData, setData } = useToken(keys);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"
          element={!data.access_token ? <SignIn setData={setData} /> : <Navigate to="/" replace />}/>
        <Route path="/"
          element={
            <ProtectedRoute token={data.access_token} role={data.user_role} removeData={removeData}>
              <JoyOrderDashboardTemplate user_full_name={data.full_name} user_email={data.email} role={data.user_role} removeData={removeData} />
            </ProtectedRoute>}>
          <Route index element={<OrderTable token={data.access_token} role={data.user_role} />} />
          <Route path="groups"
            element={
              <ProtectedRoute token={data.access_token} role={data.user_role} removeData={removeData} requiredRoles={['admin']}>
                <GroupTable token={data.access_token} />
              </ProtectedRoute>}/>
          <Route path="users"
            element={
              <ProtectedRoute token={data.access_token} role={data.user_role} removeData={removeData} requiredRoles={['admin']}>
                <UserTable token={data.access_token} />
              </ProtectedRoute>}/>
          <Route path="map"
          element={
            <ProtectedRoute token={data.access_token} role={data.user_role} removeData={removeData} requiredRoles={['admin']}>
              <Map />
            </ProtectedRoute>}/></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>);}
export default Router



