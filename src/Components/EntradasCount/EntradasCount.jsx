import React from 'react'
import '../EntradasCount/EntradasCount.css'



const EntradasCount = ({ count, increment, decrement }) => {

  return (
    <div className="Controls">

        <button className="ButtonContadorM" onClick={decrement}>-</button>
        <h4 className="Number">{count}</h4>
        <button className="ButtonContador" onClick={increment}>+</button>
    </div>

  )
  
}

export default EntradasCount