// Internal Modules
import styles from "./page.module.scss";
import { fetchProductos } from "./services/firebase.service";
import Image from "next/image";
import LayoutBanners from "./_components/LayoutBanners/LayoutBanners";
import Link from "next/link";
import HistoryContainer from "./_components/HistoryContainer/HistoryContainer";



// export const dynamic = 'force-dynamic';

export default async function Home() {

  const productos = await fetchProductos()

  return (
    <div className={`${styles.page} ${styles.listGroup} ${styles.CardContainer}`}>
      {
        productos?.map((prod) => (
          <div key={prod.id}>
            <LayoutBanners />
            <div className={styles.card}>
              <div className={styles.datosContainer}>
               <Image src={prod.image} width={1900} height={100} alt='Background Image' layout='responsive' className={`${styles.backgroundImage} ${styles.desktop}`}/>
               <Image src={prod.image2} width={100} height={100} alt='Background Image' layout='responsive' className={`${styles.backgroundImage} ${styles.mobile}`}/>
                <div className={styles.renglon}>
                  <p className={`${styles.dia} ${styles.texto}`}>{prod.dia}</p>
                  <p className={`${styles.fecha} ${styles.texto}`}>{prod.fecha}</p>
                  <p className={`${styles.hora} ${styles.texto}`}>{prod.hora}</p>
                  <p className={`${styles.lugar} ${styles.texto}`}>{prod.lugar}</p>
                </div>
        
                <p className={`${styles.renglonResponsive} ${styles.texto}'`}>
                  {prod.dia} - {prod.fecha} - {prod.hora}
                  <br />
                  {prod.lugar}
                </p>
        
                <Link href={`/pages/card-detail/${prod.id}`} className={styles.buyButton}>Adquirir Entrada</Link>
              </div>
              
            </div>
          </div>
          
        ))
 
      }  

      <HistoryContainer />
    </div>
  );
}
