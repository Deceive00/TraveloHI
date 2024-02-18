import { useEffect, useState } from "react";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import style from "./ManagePromos.module.scss";
import axios, { AxiosError } from "axios";
import PromoList from "../../../components/Admin/PromoList/PromoList";
import { useForm } from "react-hook-form";
import PromotionCard from "../../../components/home-page/PromotionCard/PromotionCard";
import TextField from "../../../components/form/Textfield";
import { promoRules, uploadImage } from "../../../utils/utils";
import FileInput from "../../../components/form/FileInput/FileInput";
import Snackbar from "../../../components/form/Snackbar";
import Loading from "../../../components/Loading/Loading";

const promotionTypeOptions = ["Hotel", "Flight"];
export default function ManagePromos() {
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<IPromotion>();
  const [image, setImage] = useState<File | null>(null);
  const [currentImageURL, setCurrentImageURL] = useState<string | null>("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IPromotion>();
  const watchedValues = watch();
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
  const isFormFilled = () => {
    if (
      selectedPromotion?.promotionCode === watchedValues.promotionCode &&
      selectedPromotion.promotionName === watchedValues.promotionName &&
      selectedPromotion.promotionType === watchedValues.promotionType &&
      selectedPromotion.promotionStartDate === watchedValues.promotionStartDate &&
      selectedPromotion.promotionEndDate === watchedValues.promotionEndDate && 
      selectedPromotion.promotionPercentage === watchedValues.promotionPercentage && 
      (image === null && currentImageURL === selectedPromotion.promotionImage)
    ) {
      return true;
    }
    return false;
  };
  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      let imageURL;
      if (image) {
        const ext = image.name.split(".")[1];
        const promotionCode = data.promotionCode;
        const filename = `promotion/images/${promotionCode}.${ext}`.replace(
          /\n/g,
          ""
        );
        imageURL = await uploadImage(filename, image);
      } else {
        imageURL = data.promotionImage;
      }
      data["promotionPercentage"] = parseInt(data["promotionPercentage"]);
      const stringifiedData = JSON.stringify({
        ...data,
        promotionImage: imageURL,
      });

      console.log({
        ...data,
        promotionImage: imageURL,
      });
      const response = await axios.put(
        "http://localhost:8080/api/admin/update-promotion",
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
  useEffect(() => {
    const fetchAllPromotions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/get-all-promotions",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setPromotions(response.data.promotions);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPromotions();
  }, []);

  const handlePromoClicked = (promotion: IPromotion) => {
    setIsOpenDetail(true);
    setSelectedPromotion(promotion);
    setValue("id", promotion.id);
    setValue("promotionPercentage", promotion.promotionPercentage);
    setValue("promotionName", promotion.promotionName);
    setValue("promotionStartDate", promotion.promotionStartDate);
    setValue("promotionEndDate", promotion.promotionEndDate);
    setValue("promotionCode", promotion.promotionCode);
    setValue("promotionType", promotion.promotionType);
    setValue("promotionImage", promotion.promotionImage);
    setCurrentImageURL(promotion.promotionImage);
  };
  return (
    <>
      {loading && <Loading />}
      <AdminTemplate>
        <div className={style.contentContainer}>
          <h1>Manage Promos</h1>
          <div className={style.managePromotionContainer}>
            <div className={style.leftSideContent}>
              <div className={style.promotionListContainer}>
                <h2>Promotion Lists</h2>
                <div className={style.promotionList}>
                  {promotions.map((promotion: IPromotion) => (
                    <PromoList
                      promotions={promotion}
                      key={promotion.promotionCode}
                      onClick={handlePromoClicked}
                      isActive={
                        selectedPromotion?.promotionCode ===
                        promotion.promotionCode
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={style.promotionDetailContainer}>
              {isOpenDetail && (
                <div className={style.promotionDetail}>
                  <div className={style.promotionPreview}>
                    <div className={style.promotionCard}>
                      <PromotionCard
                        promotion={watchedValues}
                        image={currentImageURL}
                      />
                    </div>
                  </div>
                  <form
                    action=""
                    className={style.promotionForm}
                    onSubmit={handleSubmit(onSubmit)}
                  >
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
                        defaultValue={selectedPromotion?.promotionName}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="">Promotion Type</label>
                      <select
                        {...register("promotionType")}
                        defaultValue={selectedPromotion?.promotionType}
                      >
                        <option
                          value=""
                          disabled
                          className={style.defaultValue}
                        >
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
                        defaultValue={selectedPromotion?.promotionPercentage}
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
                        defaultValue={selectedPromotion?.promotionCode}
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
                        defaultValue={selectedPromotion?.promotionStartDate}
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
                        defaultValue={selectedPromotion?.promotionEndDate}
                      />
                    </div>

                    <button type="submit" className={`${style.insertButton}`} disabled={isFormFilled()}>
                      Update
                    </button>
                  </form>
                </div>
              )}
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
