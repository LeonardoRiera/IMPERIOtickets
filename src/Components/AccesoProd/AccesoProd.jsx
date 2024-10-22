import React from 'react'
import '../AccesoProd/AccesoProd.css'
import logoFloat from '../../assets/logoblancoSinFondo1.png'


const AccesoProd = () => {



  return (
    <div className='accesoProdContainer'>
    <div className="container w-75 mt-5 mb-5 rounded shadow">

      <div className="row aligns-items-strech formRow">

        <div className="col bg d-none d-lg-block col-xs-12 col-lg-6 col-xl-6 rounded logoform">
          <img src={logoFloat}  alt="logo" className='logoblanco2' /> 
          
        </div>

        <div className="col col-xs-12 bg-white p-5 rounded-end">

          

          <h2 className="fw-bold text-center py-3 formulario-titulo">Imperio Ticket - Ingreso Panel Administrativo</h2>



          <form action="#">
            <div className="mb-2">
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input type="email" className="form-control" name="email" />
            </div>

            <div className="mb-2">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" />
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </div>

          </form>

        </div>
      </div>
    </div>



    </div>

  )
}

export default AccesoProd;