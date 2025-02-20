import './App.css';
import React from 'react';
import { BrowserRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import GuiaDeCompra from './Screens/GuiaDeCompra/GuiaDeCompra';
import AccesoProd from './Components/AccesoProd/AccesoProd';
import CardContainer from './Components/CardContainer/CardContainer';
import CardDetail from './Screens/CardDetail/CardDetail';
import PanelAdminEvento from './Screens/PanelAdminEvento/PanelAdminEvento';
import AtencionCliente from './Screens/AtencionCliente/AtencionCliente';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';
import Success from './Screens/Success/Success';
import Error from './Screens/Error/Error';
import Pending from './Screens/Pending/Pending';
import Failure from './Screens/Failure/Failure';
import VentaFinal from './Screens/VentaFinal/VentaFinal';
import Scanner from './Screens/Scanner/Scanner'

function App() {

  return (

    <BrowserRouter>

      <div className='APP container-fluid'>

        <Navbar />

        <Routes>

          <Route path="/" element={<CardContainer/>}/>

          <Route path="/GuiaCompra" element={<GuiaDeCompra />} />

          <Route path="/AtencionAlCliente" element={<AtencionCliente />} />

          <Route path="/AccesoProductores" element={<AccesoProd />} />

          <Route path='/CardDetail' element={<CardDetail/>} />

          <Route path="/PanelAdminEvento" element={<PanelAdminEvento />} />

          <Route path="/Success" element={<Success />} />

          <Route path="*" element={<Error />} />

          <Route path="/Pending" element={<Pending />} />

          <Route path="/Failure" element={<Failure />} />

          <Route path="/VentaFinal" element={<VentaFinal />} />

          <Route path="/Scanner" element={<Scanner />} />

        </Routes>

        <Footer />

      </div>

    </BrowserRouter>

  )

}

export default App
