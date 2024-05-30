import { useState } from 'react';

function useToken() {

  function getToken() {
    const userToken = localStorage.getItem('accessToken');
    return userToken && userToken
  }

  const [token, setToken] = useState(getToken());
  console.log(token);
  const [role, setRole] = useState(getRole());
  console.log(role);
  function getRole(){
    const userRole = localStorage.getItem('role');
    return userRole && userRole
  }
  function saveToken(userToken) {
    localStorage.setItem('accessToken', userToken["access_token"]);
    setToken(userToken["access_token"]);
  };

  function saveRole(userRole) {
    localStorage.setItem('role', userRole["user_role"]);
    setRole(userRole["user_role"]);
  };

  function removeToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setToken(null);
  }

  return {
    setToken: saveToken,
    setRole: saveRole,
    token,
    role,
    removeToken
  }

}

export default useToken;
