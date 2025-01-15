import './App.css';
import { BrowserRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import GuiaDeCompra from './Components/GuiaDeCompra/GuiaDeCompra';
import AccesoProd from './Components/AccesoProd/AccesoProd';
import CardContainer from './Components/CardContainer/CardContainer';
import CardDetail from './Components/CardDetail/CardDetail';
import PanelAdminEvento from './Components/PanelAdminEvento/PanelAdminEvento';
import AtencionCliente from './Components/AtencionCliente/AtencionCliente';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';
import Success from './Components/Success/Success';
import Error from './Components/Error/Error';
import Pending from './Components/Pending/Pending';
import Notifications from './Components/Notifications/Notifications';
import VentaFinal from './Components/VentaFinal/VentaFinal';


function App() {

  return (

    
      <BrowserRouter>

        <div className='APP'>

          <Navbar />
          
          <Routes>

            <Route path="/" element={<CardContainer/>}/>
            <Route path="/GuiaCompra" element={<GuiaDeCompra />} />
            <Route path="/AtencionAlCliente" element={<AtencionCliente />} />
            <Route path="/AccesoProductores" element={<AccesoProd />} />
            <Route path='/CardDetail' element={<CardDetail/>} />
            <Route path="/PanelAdminEvento" element={<PanelAdminEvento />} />
            <Route path="/Success" element={<Success />} />
            <Route path="/Error" element={<Error />} />
            <Route path="/Pending" element={<Pending />} />
            <Route path="/Notifications" element={<Notifications />} />
            <Route path="/VentaFinal" element={<VentaFinal />} />

          </Routes>
             
          <Footer />

        </div>

      </BrowserRouter>
   
  )

}

export default App
