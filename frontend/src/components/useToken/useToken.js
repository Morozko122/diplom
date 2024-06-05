import { useState } from 'react';

function useToken(keys_array) {
  const [data, setData] = useState(getDefault(keys_array));
  const xeyak = {};
  function save(data_key, data) {
 
    localStorage.setItem(data_key, data[data_key]);
    xeyak[data_key] = data;
    setData(xeyak);
  }
  
  function getDefault() {
    const get_values = {};
    keys_array.forEach(key => {
      get_values[key] = get(key);
    });
    return get_values;
  }

  function get(key) {
    const value = localStorage.getItem(key);
    return value && value
  }
  
  function removeData() {
    keys_array.forEach(key => {
      localStorage.removeItem(key);
    });
    setData({});
  }

  return {
    setData: save,
    data,
    removeData
  }
}

export default useToken;
