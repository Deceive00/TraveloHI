import React, { useState } from "react";
import TextField from "../form/Textfield";
import Modal from "../Modal/Modal";
import { useForm } from "react-hook-form";
import style from "./AddCardModal.module.scss";
import ComboBox from "../form/ComboBox/Combobox";
import { BANK } from "../../utils/Items";
import axios from "axios";
import Loading from "../Loading/Loading";
const AddCardModal = ({
  isOpen,
  onRequestClose,
  showSnackbar,
  refetch,
}: {
  isOpen: boolean;
  onRequestClose: any;
  showSnackbar: any;
  refetch: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const bankNames = BANK.map((bank) => bank.name);
  const [loading, setLoading] = useState(false);
  const cardRules = {
    accountName: {
      required: "required*",
    },
    accountNumber: {
      required: "required*",
      pattern: {
        value: /^[0-9]+$/,
        message: "Must be numeric",
      },
    },
    cvv: {
      required: "required*",
      pattern: {
        value: /^[0-9]+$/,
        message: "Must be numeric",
      },
      minLength: {
        value: 3,
        message: "Must be exactly 3 characters",
      },
      maxLength: {
        value: 3,
        message: "Must be exactly 3 characters",
      },
    },
    bank: {
      required: "required*",
    },
  };

  const onSubmit = async (formData: any) => {
    try {
      setLoading(true);
      const body = JSON.stringify(formData);
      console.log(body);
      const response = await axios.post(
        "http://localhost:8080/api/add-credit-card",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        console.log("Succesfully added credit cards");
        showSnackbar(response.data.message, "success");
        refetch();

      }
    } catch (error) {
    } finally {
      handleCloseModal();
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    reset();
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseModal}>
      <h2 style={{ marginBottom: "2vh" }}>Add Card</h2>
      {loading && <Loading />}
      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)} className={style.addCardForm}>
          <ComboBox
            label="Bank"
            name="bankName"
            options={bankNames}
            register={register}
            rules={cardRules.bank}
            error={errors.bankName}
          />
          <TextField
            label="Account Name"
            name="accountName"
            type="text"
            register={register}
            error={errors.accountName}
            rules={cardRules.accountName}
          />
          <TextField
            label="Account Number"
            name="accountNumber"
            type="text"
            register={register}
            error={errors.accountNumber}
            rules={cardRules.accountNumber}
          />
          <TextField
            label="CVV"
            name="cvv"
            type="password"
            register={register}
            error={errors.cvv}
            rules={cardRules.cvv}
          />
          <button type="submit" className={style.addButton}>
            Add Card
          </button>
        </form>
      )}
    </Modal>
  );
};

export default AddCardModal;
