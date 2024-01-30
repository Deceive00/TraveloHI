import { FaChevronLeft } from "react-icons/fa";
const BackButton = ({ className, onClick } : { className : any, onClick : any}) => {
  return (
    <button style={{background:'none',border:'none'}} className={className} onClick={onClick}>
      <FaChevronLeft size={'1.5rem'}/>
    </button>
  );
};

export default BackButton;
