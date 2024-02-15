import React, { useState } from "react";
import styles from './Combobox.module.scss';

const ComboBox = ({ label, name, options, register, rules, error, setValue }: { label: any, name : any, options: any, register : any, rules : any,  error?: any , setValue? : any}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    setIsOpen(true); 
  };

  const handleSelect = (option: string) => {
    setValue(name, option);
    setSelectedOption(option);
    setSearchTerm(option)
    setIsOpen(false); 
  };

  const filteredOptions = options.filter((option: any) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='input-group'>
      <label htmlFor="customSelect">{label}</label>
      <div className={styles.customSelectContainer}>
        <div className={styles.selectContainer}>
          <input
            type="text"
            name={name}
            {...register(name, rules)}
            className={`form-input ${error ? 'error' : ''}`}
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            onClick={() => setIsOpen(true)} 
          />
          {isOpen && (
            <ul className={styles.optionsList}>
              {filteredOptions.map((option: any, index: any) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={styles.option}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <div className="error-message">{error.message}</div>}
      </div>
    </div>
  );
};

export default ComboBox;
