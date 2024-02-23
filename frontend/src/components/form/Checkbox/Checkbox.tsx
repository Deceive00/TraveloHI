import { FaCheck } from "react-icons/fa";
import style from "./Checkbox.module.scss";
interface ICheckboxProps{
  value: any;
  id: any;
  onChange: any;
}
export default function Checkbox({value, id, onChange} : ICheckboxProps) {
  return (
    <>
      <input type="checkbox" value={value} id={id} onChange={onChange} />
      <label htmlFor={id} className={style.checkboxContainer}>
        <FaCheck className={style.check} />
      </label>
    </>
  );
}
