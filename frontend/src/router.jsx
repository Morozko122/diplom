import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
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
import UserTable from "./components/Users/ViewUsers";
import OrderTable from "./components/OrderTable/OrderTable";
import MainPage from "./components/main/mainPage (старая функция проверки) ";
import GroupTable from "./components/Group/ViewGroup";
import useToken from "./components/useToken/useToken";



function ProtectedRoute({ token, role, requiredRoles, children }) {
  if (!token || token === "" || token === undefined) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/adsad" replace />;
  }

  return children;
}



function Router() {
  const { token, role, setRole, removeToken, setToken, setId } = useToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TemplatePage />}>
          <Route path="login" element={!token ? <SignIn setToken={setToken} setRole={setRole} setId={setId} /> : <Navigate to="/main" replace />} />
          <Route
            path="main"
            element={
              <ProtectedRoute token={token} role={role}>
                <JoyOrderDashboardTemplate role={role} removeToken={removeToken} />
              </ProtectedRoute>
            }
          >
            <Route index element={<OrderTable token={token} />} />
            <Route
              path="roles"
              element={
                <ProtectedRoute token={token} role={role} requiredRoles={['admin']}>
                  <RoleTable token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="groups"
              element={
                <ProtectedRoute token={token} role={role} requiredRoles={['admin']}>
                  <GroupTable token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute token={token} role={role} requiredRoles={['admin']}>
                  <UserTable token={token} />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="test" element={<MainPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router






// <BrowserRouter>
//    <Routes>
//       <Route path="/" element={<TemplatePage />}>
//          {!token && token !== "" && token !== undefined ?
//             <Route path="login" element={<SignIn setToken={setToken} setRole={setRole} />} /> : (
//                <Route path="main" element={<JoyOrderDashboardTemplate removeToken={removeToken} />} >
//                   <Route index element={<OrderTable token={token} />} />
//                   <Route path="roles" element={<RoleTable token={token} />} />
//                   <Route path="users" element={<UserTable token={token} />} />
//                </Route>
//          )}
//          <Route path="test" element={<MainPage />} />
//       </Route>
//       <Route element={<PageNotFound />} path="*" />
//    </Routes>
// </BrowserRouter>