'use client'
import React from 'react';
import ItemCards from '../ItemCards/ItemCards.jsx';
// import './CardContainer.css'
import { useEffect, useState } from 'react'
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConfing.js";

const CardContainer = () => {

  const [productos, setProductos] = useState([]);

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

  // useEffect scrollear al inicio y cargar los productos cuando el componente se monte
  useEffect(() => {

    fetchProductos(); // Llamamos a la función async dentro de useEffect

  }, []);


  return (
    <div className='CardContainer'>

      <ItemCards productos={productos}/>

    </div>
  )
}

export default CardContainer