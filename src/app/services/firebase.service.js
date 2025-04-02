import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfing.js";

// Para la lista de productos (Home)
export const fetchProductos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "ListaBandas"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching productos: ", error);
    return [];
  }
};

// Para obtener un producto individual por ID
export const getProductoById = async (id) => {
  try {
    const docRef = doc(db, 'ListaBandas', id); // Cambiado de 'productos' a 'ListaBandas'
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('El documento no existe');
    }
    
    return { 
      id: docSnap.id,
      ...docSnap.data(),
      // Asegurar que todos los campos requeridos existan
      imageDetail: docSnap.data().imageDetail || '',
      title: docSnap.data().title || 'Sin título',
      price: docSnap.data().price || 0,
      dia: docSnap.data().dia || '',
      fecha: docSnap.data().fecha || '',
      hora: docSnap.data().hora || '',
      lugar: docSnap.data().lugar || '',
      clasificacion: docSnap.data().clasificacion || ''
    };
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    throw new Error(`Error al cargar el producto: ${error.message}`);
  }
};