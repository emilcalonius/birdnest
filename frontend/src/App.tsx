import axios from 'axios';
import { useEffect, useState } from 'react'
import { getPositions } from './api/data';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const data  = getPositions();
    console.log(data);
  }, [])
  

  return (
    <div className="App">
      
    </div>
  )
}

export default App
