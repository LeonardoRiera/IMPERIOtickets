// Internal Modules
import styles from "./page.module.css";
import { fetchProductos } from "./services/firebase.service";
import CardContainer from "./components/CardContainer/CardContainer";
export const dynamic = 'force-dynamic';

export default async function Home() {

  const productos = await fetchProductos()

  return (
    <div className={styles.page}>
      
      <CardContainer productos={productos} />
      
    </div>
  );
}
