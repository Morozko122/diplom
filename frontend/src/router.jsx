import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
// import Login from "./components/Login/login"
// import MainPage from "./components/main/mainPage"
import PageNotFound from "./components/NotFoundPage/pageNotFound"
import SignIn from "./components/Login/Login";
import JoyOrderDashboardTemplate from "./components/main/MainPage";
import UserTable from "./components/Users/ViewUsers";
import OrderTable from "./components/OrderTable/OrderTable";
import GroupTable from "./components/Group/ViewGroup";
import useToken from "./components/useToken/useToken";
import { Outlet } from "react-router-dom";

const keys = [
  'access_token', 'user_role', 'user_id'
]

function ProtectedRoute({ token, role, requiredRoles, children }) {
  console.log(token);
  if (!token || token === "" || token === undefined) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/pageNotFound" replace />;
  }
  return children;
}

function Router() {
  const { data, removeData, setData} = useToken(keys);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet/>}>
          <Route path="login" element={!data.access_token ? <SignIn setData={setData} />
           : <Navigate to="/main" replace />} />
          <Route path="main"
            element={
              <ProtectedRoute token={data.access_token} role={data.user_role}>
                <JoyOrderDashboardTemplate role={data.user_role} removeData={removeData} />
              </ProtectedRoute>}>
            <Route index element={<OrderTable token={data['access_token']} />} />
            <Route path="groups"
              element={
                <ProtectedRoute token={data['access_token']} role={data['user_role']} requiredRoles={['admin']}>
                  <GroupTable token={data['access_token']} />
                </ProtectedRoute>}/>
            <Route path="users"
              element={
                <ProtectedRoute token={data['access_token']} role={data['user_role']} requiredRoles={['admin']}>
                  <UserTable token={data['access_token']} />
                </ProtectedRoute>}/></Route></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router