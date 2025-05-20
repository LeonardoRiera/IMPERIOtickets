'use client'

import React from 'react'
import styles from './AccesoProd.module.css'
import Image from 'next/image'

import LoginForm from '@/app/_components/login/Login'

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

          < LoginForm />
        </div>
      </div>
    </div>
  )
}

export default AccesoProductores

