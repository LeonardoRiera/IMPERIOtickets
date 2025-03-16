import styles from "./page.module.css";
import Header2 from '@/components/Header2/Header2.jsx';

// Internal Modules
import CardContainer from "@/components/CardContainer/CardContainer";
export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <div className={styles.page}>
      
      <Header2 />
      {/* <main className={styles.main}> */}
      <CardContainer />

      {/* </main> */}
      
    </div>
  );
}
