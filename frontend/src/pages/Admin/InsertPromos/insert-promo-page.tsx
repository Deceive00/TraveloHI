import { useForm } from "react-hook-form";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import style from "./insert-promo-page.module.scss";
import TextField from "../../../components/form/Textfield";
import FileInput from "../../../components/form/FileInput/FileInput";
import { useState } from "react";
import { promoRules, uploadImage } from "../../../utils/utils";
import axios, { AxiosError } from "axios";
import Snackbar from "../../../components/form/Snackbar";
import PromotionCard from "../../../components/home-page/PromotionCard/PromotionCard";
import Loading from "../../../components/Loading/Loading";

const promotionTypeOptions = ["Hotel", "Flight"];

export default function InsertPromoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IPromotion>();
  const watchedValues = watch();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentImageURL, setCurrentImageURL] = useState<string | null>("");
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  const handleImageChange = (files: File | null) => {
    if (files) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const dataURL = event.target.result;
        setCurrentImageURL(dataURL);
      };
      reader.readAsDataURL(files);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (!image) {
        showSnackbar("Please insert promotions image!", "error");
        return;
      }

      const ext = image.name.split(".")[1];
      const promotionCode = data.promotionCode;
      const filename = `promotion/images/${promotionCode}.${ext}`;
      const imageURL = await uploadImage(filename, image);
      data["promotionPercentage"] = parseInt(data["promotionPercentage"]);
      const stringifiedData = JSON.stringify({
        ...data,
        promotionImage: imageURL,
      });

      console.log({
        ...data,
        promotionImage: imageURL,
      });
      const response = await axios.post(
        "http://localhost:8080/api/admin/insert-promotions",
        stringifiedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        showSnackbar(response.data.message, "success");
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        if (
          typeof responseData === "object" &&
          responseData !== null &&
          "error" in responseData
        ) {
          setSnackbarMessage(responseData.error as string);
        }
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loading />}
      <AdminTemplate>
        <div className={style.contentContainer}>
          <h1>Insert Promos</h1>
          <div className={style.insertPromotionContainer}>
            <form
              action=""
              className={style.promotionForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <h2>Promo Detail</h2>
              <FileInput
                onFileSelect={(files: any) => {
                  setImage(files);
                  handleImageChange(files);
                }}
              />
              <div>
                <TextField
                  label="Promotion Name"
                  name="promotionName"
                  type="text"
                  register={register}
                  rules={promoRules.promotionName}
                  error={errors.promotionName}
                />
              </div>
              <div className="input-group">
                <label htmlFor="">Promotion Type</label>
                <select {...register("promotionType")} defaultValue="">
                  <option value="" disabled className={style.defaultValue}>
                    Select a promotion type
                  </option>
                  {promotionTypeOptions.map((promo, i) => (
                    <option key={i} value={promo}>
                      {promo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <TextField
                  label="Percentage"
                  name="promotionPercentage"
                  type="number"
                  register={register}
                  rules={promoRules.promotionPercentage}
                  error={errors.promotionPercentage}
                />
              </div>
              <div>
                <TextField
                  label="Promo Code"
                  name="promotionCode"
                  type="text"
                  register={register}
                  rules={promoRules.promotionCode}
                  error={errors.promotionCode}
                />
              </div>
              <div>
                <TextField
                  label="Start Date"
                  name="promotionStartDate"
                  type="date"
                  register={register}
                  rules={promoRules.startDate}
                  error={errors.promotionStartDate}
                />
              </div>
              <div>
                <TextField
                  label="End Date"
                  name="promotionEndDate"
                  type="date"
                  register={register}
                  rules={promoRules.endDate}
                  error={errors.promotionEndDate}
                />
              </div>

              <button type="submit" className={style.insertButton}>
                Insert Promotion
              </button>
            </form>
            <div className={style.promotionPreviewContainer}>
              <div className={style.promotionPreview}>
                <div className={style.promotionCard}>
                  <PromotionCard
                    promotion={watchedValues}
                    image={currentImageURL}
                  />
                </div>
              </div>
            </div>
          </div>
          <Snackbar
            message={snackbarMessage}
            setShow={setSnackbarOpen}
            show={snackbarOpen}
            type={snackbarType}
          />
        </div>
      </AdminTemplate>
    </>
  );
}
