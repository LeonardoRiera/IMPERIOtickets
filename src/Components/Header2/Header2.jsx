import personaja from "../../assets/personaja2.webp";
import '../Header2/Header2.css'



const Header2 = () => {
  return (
    <div className="row header">
        <div className="col-6 image">
            <img src={personaja} alt="chica con celular" className="personaja" />

        </div>
        <div className="col-6 textos">
            <h1 className="principal">Comprá tu <br /><span className="tickets">Ticket Digital</span></h1>
            <h2 className="subtitle">Fácil y Seguro.</h2>
        </div>
        

    </div>
  )
}

export default Header2