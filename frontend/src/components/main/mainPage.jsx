
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config';


const callAdminOnlyEndpoint = async () => {
const token = localStorage.getItem('accessToken'); // Получаем токен из localStorage

if (!token) {
  console.log('Токен не найден в localStorage');
  return;
}

try {
  const response = await fetch(`${API_BASE_URL}/admin1`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Передаем токен в заголовке Authorization
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }

  const data = await response.json();
  console.log(data); // Обработка успешного ответа
} catch (error) {
  console.error('Ошибка при вызове защищенного эндпоинта:', error.message);
}
};

function MainPage() {  

  useEffect(() => {
    callAdminOnlyEndpoint();

  }, []);

  return (
    <div>
      <h1>Главная</h1>

    </div>
  );
}

export default MainPage;



