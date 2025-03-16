'use client'

import React from 'react'
import styles from './AccesoProd.module.css'
import Image from 'next/image'

const AccesoProductores = () => {
  return (
    <div className={styles.accesoProdContainer}>
      <div className="container w-75 mt-5 mb-5 rounded shadow">
        <div className={`row aligns-items-strech ${styles.formRow}`}>
          <div className={`col bg d-none d-lg-block col-xs-12 col-lg-6 col-xl-6 rounded ${styles.logoform}`}>
            <div className={styles.backgroundImageWrapper}>
              <Image
                src="/assets/fondostars.jpg"
                alt="background"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <Image 
              src="/assets/logoblancoSinFondo1.png" 
              alt="logo" 
              className={styles.logoblanco2}
              width={400}
              height={400}
              priority
            />
          </div>

          <div className="col col-xs-12 bg-white p-5 rounded-end">
            <h2 className={`fw-bold text-center py-3 ${styles.formularioTitulo}`}>
              Imperio Tickets - Ingreso Panel Administrativo
            </h2>

            <form className={styles.form}>
              <div className="mb-2">
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input type="email" className="form-control" name="email" />
              </div>

              <div className="mb-2">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-dark">Iniciar Sesión</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccesoProductores

