import './Card.scss';
import Link from 'next/link';
import Image from 'next/image';

const Card = ({ title, price, image, image2, imageDetail, dia, fecha, hora, lugar, description, clasificacion }) => {

  return (
    <div className="card">



      <div className='datosContainer'>
      <Image src={image} width={1900} height={100} alt='Background Image' layout='responsive' className='background-image desktop'/>
      <Image src={image2} width={100} height={100} alt='Background Image' layout='responsive' className='background-image mobile'/>
        <div className='renglon'>
          <p className='dia texto'>{dia}</p>
          <p className='fecha texto'>{fecha}</p>
          <p className='hora texto'>{hora}</p>
          <p className='lugar texto'>{lugar}</p>
        </div>

        <p className='renglon-responsive texto'>
          {dia} - {fecha} - {hora}
          <br />
          {lugar}
        </p>

        <Link href={{pathname:'/pages/card-detail', query:{image, image2, imageDetail, title, price, dia, fecha, hora, lugar, description, clasificacion}}} className='buyButton'>Adquirir Entrada</Link>
      </div>


    </div>
  );
};

export default Card;