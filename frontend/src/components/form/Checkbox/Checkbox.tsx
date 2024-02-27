import { FaCheck } from "react-icons/fa";
import style from "./Checkbox.module.scss";
interface ICheckboxProps{
  value: any;
  id: any;
  onChange: any;
  checked?: boolean;
}
export default function Checkbox({value, id, onChange, checked} : ICheckboxProps) {
  return (
    <div className={style.checkbox}>
      <input type="checkbox" value={value} id={id} onChange={onChange} checked={checked}/>
      <label htmlFor={id} className={style.checkboxContainer}>
        <FaCheck className={style.check} />
      </label>
    </div>
  );
}
