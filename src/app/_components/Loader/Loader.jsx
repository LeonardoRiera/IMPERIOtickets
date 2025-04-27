import Image from 'next/image';
import './Loader.scss'

const Loader = () => {
  return (
    <div className="loader-container">
        <Image
          className='loader'
          alt='loader'
          src={'/assets/isotipoEstrellas.png'}

          width={140}
          height={150}
        />
    </div>
  );
};

export default Loader;