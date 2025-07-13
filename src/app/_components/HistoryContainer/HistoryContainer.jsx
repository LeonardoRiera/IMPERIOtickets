import React from 'react'
import styles from "./HistoryContainer.module.scss";
import EventHistory from '../EventHistory/EventHistory'


const HistoryContainer = () => {
  return (
    <div className={styles.ContStyle}>
      <h2 className={styles.eventTitle}>Eventos Anteriores</h2>
      < EventHistory
        desktopImage="/tiembGr.webp"
        mobileImage="/tiembCH.webp"
      />

      < EventHistory
        desktopImage="/boheGr.webp"
        mobileImage="/boheCH.webp"
      />
    </div>
  )
}

export default HistoryContainer