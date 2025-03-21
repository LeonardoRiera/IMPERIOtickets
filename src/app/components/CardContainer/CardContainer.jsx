// Internal Modules
import LayoutBanners from '../../components/LayoutBanners/LayoutBanners'
import ItemCards from '../ItemCards/ItemCards.jsx';
import './CardContainer.scss';

const CardContainer = ({ productos }) => {
  return (
    <div className='CardContainer'>
      <LayoutBanners />
      <ItemCards productos={productos} />
    </div>
  );
};

export default CardContainer;