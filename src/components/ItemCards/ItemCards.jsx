import React from 'react';
import './ItemCards.css';
import Card from '../Card/Card.jsx';


const ItemCards = ({ productos }) => {

  return(
    <div className="ListGroup">
      {productos?.map(prod => <Card key={prod.id} {...prod} />)}
    </div>
  )
}

export default ItemCards;