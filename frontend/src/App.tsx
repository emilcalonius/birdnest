import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';
import List from './components/list/List';

function App() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    setInterval(() => {
      axios.get("http://localhost:3000/api/drones")
      .then(res => setDrones(res.data));
    }, 2000);
  }, []);

  useEffect(() => {
    console.log(drones);
  }, [drones]);
  

  return (
    <div className="App">
      <List />
    </div>
  )
}

export default App
