'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './Failure.module.css'

export default function Failure() {
  return (
    <div className={styles.failureContainer}>
      <Image
        src="/error.png"
        alt="logo de error"
        width={200}
        height={200}
        className={styles.logoError1}
      />

      <p className={styles.number1}>- ERROR -</p>

      <p className={styles.tituloError1}>Lo sentimos, tu pago no se ha podido procesar.</p>

      <p className={styles.tituloError1}>. Verifica que los datos de tu tarjeta sean correctos y que tengas fondos suficientes</p>

      <p className={styles.tituloError1}>. Intenta realizar el pago con otra tarjeta o método de pago disponible</p>

      <p className={styles.tituloError1}>. Si el problema persiste, por favor contacta a nuestro equipo de soporte al cliente</p>

      <Link className={styles.volverAInicio1} href='/'>Volver a Inicio</Link>
    </div>
  )
}
