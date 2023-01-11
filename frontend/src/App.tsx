import axios from 'axios';
import { useEffect } from 'react'
import './App.css'

function App() {

  const fetchDrones = setInterval(() => {
    const drones = axios.get("http://localhost:3000/api/drones")
    .then(res => console.log(res));
  }, 2000);
  

  return (
    <div className="App">
      
    </div>
  )
}

export default App
