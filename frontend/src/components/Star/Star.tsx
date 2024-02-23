import { FaStar } from "react-icons/fa6";
import style from "./Star.module.scss";

interface IStarProps {
  star: number;
}
export default function Star({ star }: IStarProps) {
  return (
    <div className={style.starContainer}>
      {[...Array(star)].map((_, index) => (
        <FaStar key={index}/>
      ))}
    </div>
  );
}
