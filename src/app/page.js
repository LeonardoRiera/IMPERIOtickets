import styles from "./page.module.css";

// Internal Modules
import CardContainer from "./components/CardContainer/CardContainer";
export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <div className={styles.page}>
      
      <CardContainer />
      
    </div>
  );
}
