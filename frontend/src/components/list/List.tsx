import axios from 'axios';
import { useEffect, useState } from 'react';
import { IDrone } from '../../types/Drone';

function List() {
  const [violatingDrones, setViolatingDrones] = useState(new Set<string>());

  useEffect(() => {
    
  }, [])
  

  return (
    <div className="list">
      <ul className="violating-drones">
        {
          Array.from(violatingDrones).map((drone: string, index: number) => {
            return(
              <li className="drone" key={index}>
                {drone}
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default List