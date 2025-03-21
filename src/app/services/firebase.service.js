import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebaseConfing.js";

export const fetchProductos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "ListaBandas"));
    const productosArray = [];

    querySnapshot.forEach((doc) => {
      productosArray.push({ id: doc.id, ...doc.data() });
    });

    return productosArray;
  } catch (error) {
    console.error("Error fetching productos: ", error);
    return [];
  }
};