
'use client';
import React from 'react';
import { useState } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/imagologoTickets.png';

const Header = () => {

  const [menuEstado, setMenuEstado] = useState(false);

  const toggleMenu = () => {
    setMenuEstado(!menuEstado);
  };

  const cerrarMenu = () => {
    setMenuEstado(false);
  }

  return (

    <header id={styles.header}>
      <nav className={styles.navbar}>

        <div className={styles.navbarContainer}>

          <Link href="/" className={styles.linkLogo}>

            <Image src={logo} alt="Logo Navbar" className={styles.logoCompleto}/>
          
          </Link>

          <div className={styles.menuIcono} onClick={toggleMenu}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <span className="material-icons " style={{ fontSize: "5vmax" }}>menu</span>
          </div>

          <ul className={`${styles.navlinks} ${menuEstado ? styles.activo : styles.saliendo}`}>

            <li >
              <Link  href="/" className={styles.linksMenu} onClick={cerrarMenu} >Shows</Link> 
            </li>

            <li >
              <Link  href='/pages/guia-de-compra' className={styles.linksMenu} onClick={cerrarMenu}>Guía de Compra</Link>
            </li>

            <li >
              <Link  href='/pages/atencion-al-cliente' className={styles.linksMenu} onClick={cerrarMenu}>Atención al Cliente</Link>
            </li>  

            <li >
              <Link  href="/pages/acceso-productores" className={styles.linksMenu} onClick={cerrarMenu}>Acceso Productores</Link>
            </li>  

            <li >
              <Link  href="#footer" className={styles.linksMenu} onClick={cerrarMenu}>Contacto</Link>
            </li>  

          </ul>


        </div>

      </nav>
    </header>

  )

}

export default Header;
