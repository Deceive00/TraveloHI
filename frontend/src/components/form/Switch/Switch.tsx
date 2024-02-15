import { useState, useEffect } from 'react';
import style from './Switch.module.scss'; 

const SwitchToggle = ({ initialValue, onChange } : { initialValue : boolean | undefined, onChange : any}) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  useEffect(() => {
    setIsChecked(initialValue);
  }, []);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  };

  return (
    <div className={style.switch}>
      <input
        id="toggle-btn"
        className={style.toggle}
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <label htmlFor="toggle-btn"></label>
    </div>
  );
};

export default SwitchToggle;
