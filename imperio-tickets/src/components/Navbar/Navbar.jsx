/* global bootstrap */
'use client';
import { useEffect } from 'react';
import './Navbar.css';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/imagologoTickets.png';

const Navbar = () => {
  
  useEffect(() => {
    // Selecciona todos los enlaces dentro del navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Añade un evento de clic a cada enlace
    navLinks.forEach(link => {
      link.addEventListener('click', function () {

        // Selecciona el menú colapsable
        const navbarCollapse = document.getElementById('navbarNav');

        // Cierra el menú colapsable
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false // Evita que se abra de nuevo automáticamente
        });

        bsCollapse.hide(); // Cierra el menú

      });
    });

    // Limpia el evento al desmontar el componente
    return () => {

      navLinks.forEach(link => {
        link.removeEventListener('click', function () {});
      });

    };

  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid xpander">
        <Link className="navbar-brand" href='/'><Image src={logo} alt="logo completo" className="logoCompleto" /></Link>

        <button className="navbar-toggler iconoNavbar" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="material-symbols-outlined iconColor">
            menu
          </span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {/* Navegación con hash scroll suave */}
              <Link className="nav-link" href="#shows" scroll={true}>
                Shows
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href='/GuiaDeCompra'>Guía de Compra</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href='/AtencionAlCliente'>Atención al Cliente</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/AccesoProductores">Acceso Productores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#footer">Contacto</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
