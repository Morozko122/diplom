import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config';
import { redirect  } from 'react-router-dom';

const login = async (username, password) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/login_user`, {
          username,
          password
      });
      const { access_token } = response.data;
      return access_token;
  } catch (error) {
      console.error('Error logging in111111:', error);
      throw error;
  }
};


function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(userName, password)
          .then(token => {
              localStorage.setItem('accessToken', token); //Cохранение токена доступа
          }
          )
          .catch(error => {
              console.error('Ошибка авторизации:', error);
          });
        
    } catch (error) {
      console.error(error);
    }
    redirect('/main');
  };

  useEffect(() => {


  }, []);

  return (
    <div>
      <h1>Авторизация</h1>
      <form onSubmit={handleSubmit}>
        <input type="userName" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Войти</button>
      </form>
      
    </div>
    
  );
}

export default Login;



