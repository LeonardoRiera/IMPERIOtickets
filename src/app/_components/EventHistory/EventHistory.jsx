"use client";
import Image from "next/image";
import styles from "./EventHistory.module.scss";

export default function EventHistory({desktopImage, mobileImage}) {
  return (
    <div className={styles.eventHistory}>

      {/* Imagen para escritorio */}
      <Image
        src={desktopImage}
        width={1900}
        height={400}
        alt="Eventos anteriores - Desktop"
        className={`${styles.backgroundImage} ${styles.desktop}`}
      />

      {/* Imagen para móviles */}
      <Image
        src={mobileImage}
        width={600}
        height={300}
        alt="Eventos anteriores - Mobile"
        className={`${styles.backgroundImage} ${styles.mobile}`}
      />

      <button className={styles.buyButton2}>Evento Finalizado</button>

    </div>
  );
}

