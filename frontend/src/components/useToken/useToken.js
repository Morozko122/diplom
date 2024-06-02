import { useState } from 'react';

function useToken() {

  const [token, setToken] = useState(getToken());

  function getToken() {
    const userToken = localStorage.getItem('accessToken');
    return userToken && userToken
  }

  function saveToken(userToken) {
    localStorage.setItem('accessToken', userToken["access_token"]);
    setToken(userToken["access_token"]);
  }

  const [role, setRole] = useState(getRole());

  function getRole(){
    const userRole = localStorage.getItem('role');
    return userRole && userRole
  }

  function saveRole(userRole) {
    localStorage.setItem('role', userRole["user_role"]);
    setRole(userRole["user_role"]);
  }

  const [userId, setId] = useState(getId());  

  function getId(){
    const userId = localStorage.getItem('user_id');
    return userId && userId
  }

  function saveId(userId) {
    localStorage.setItem('user_id', userId["user_id"]);
    setId(userId["user_id"]);
  }

  function removeToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setToken(null);
  }

  return {
    setToken: saveToken,
    setRole: saveRole,
    setId: saveId,
    token,
    role,
    userId,
    removeToken
  }

}

export default useToken;
