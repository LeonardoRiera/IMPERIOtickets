//migrado a cliente 0.6
import { useEffect } from 'react';
import '../Navbar/Navbar.css';
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from '../../assets/ImperioticketLogocompleto.png'

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
    }, []); // Dependencias vacías para ejecutar solo al montar el componente
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid xpander">
                <Link className="navbar-brand" to='/'><img src={logo} alt="logo completo" className="logoCompleto" /></Link>
                <button className="navbar-toggler iconoNavbar" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    
                        <span className="material-symbols-outlined iconColor">
                          
                            menu
                        
                        </span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            {/* hashLink hook scroll del nav al componente */}
                        <HashLink smooth className="nav-link" to="/">
                            Shows
                        </HashLink>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/GuiaCompra'>Guía de Compra</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/AtencionAlCliente'>Atención al Cliente</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link"  to="/AccesoProductores">Acceso Productores</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/'>Contacto</Link>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    )
}


export default Navbar;
