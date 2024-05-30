import { useNavigate } from 'react-router-dom';
function PageNotFound() {  
  const navigate = useNavigate();
  const tt = ()=>{
    navigate('/');
  }
  return (
    <div>
      <h1>Страницы не существует</h1>
      <button onClick={tt}>На главную</button>
    </div>
  );
}

export default PageNotFound;