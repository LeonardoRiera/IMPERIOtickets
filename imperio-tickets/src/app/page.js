import Image from "next/image";
import styles from "./page.module.css";

// Internal Modules
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import CardContainer from "@/components/CardContainer/CardContainer";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
      <CardContainer />

      </main>
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}
