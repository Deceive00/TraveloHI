import React from "react";
import styles from "./PriceRangeSlider.module.scss";
import TextField from "../form/Textfield";
import { useForm } from "react-hook-form";

interface PriceRangeSliderProps {
  minDefaultValue: number;
  maxDefaultValue: number;
  setMinValue: (value: number) => void;
  setMaxValue: (value: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minDefaultValue,
  maxDefaultValue,
  setMinValue,
  setMaxValue,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const minPrice = watch("minPrice", minDefaultValue);
  const maxPrice = watch("maxPrice", maxDefaultValue);

  React.useEffect(() => {
    setMinValue(minPrice);
  }, [minPrice, setMinValue]);

  React.useEffect(() => {
    setMaxValue(maxPrice);
  }, [maxPrice, setMaxValue]);

  return (
    <div className={styles.container}>
      <div style={{width:'45%'}}>
        <TextField
          error={errors.minPrice}
          label="Min"
          name="minPrice"
          register={register}
          rules={{}}
          defaultValue={minDefaultValue}
          type="number"
        />
      </div>
      <div style={{width:'45%'}}>
        <TextField
          error={errors.maxPrice}
          label="Max"
          name="maxPrice"
          register={register}
          rules={{}}
          defaultValue={maxDefaultValue}
          type="number"
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
