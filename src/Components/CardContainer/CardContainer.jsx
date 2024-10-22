import ItemCards from '../ItemCards/ItemCards.jsx';
import '../CardContainer/CardContainer.css'
import React, { useEffect, useState } from 'react'
import { getDocs, collection } from "firebase/firestore"; 
import { db } from "../../services/firebaseConfing.js";
import Header from '../Header/Header.jsx';




const CardContainer = () => {

    /* const handleBuyClick = (product) => {
        console.log(`Compraste el producto: ${product}`);
    }; */
    const [productos, setProductos] = useState([]);
    console.log(productos)
  // Función asíncrona que obtiene los productos de Firestore
  const fetchProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ListaBandas"));
      const productosArray = [];
      querySnapshot.forEach((doc) => {
        productosArray.push({ id: doc.id, ...doc.data() });
      });
      setProductos(productosArray);
    } catch (error) {
      console.error("Error fetching productos: ", error);
    }
  };

  // useEffect para cargar los productos cuando el componente se monte
  useEffect(() => {
    fetchProductos(); // Llamamos a la función async dentro de useEffect
    
  }, []);



  return (
    <div className='CardContainer'>
      <Header />

      <ItemCards productos={productos}/>

    </div>
  )
}
 
export default CardContainer