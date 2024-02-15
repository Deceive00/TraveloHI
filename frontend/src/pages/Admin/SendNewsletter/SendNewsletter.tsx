import { useForm } from "react-hook-form";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import style from "./SendNewsletter.module.scss";
import TextField from "../../../components/form/Textfield";
import axios from "axios";
import AdminTemplate from "../../../templates/admin-template/admin-template";
export default function SendnewsLetter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const stringifiedData = JSON.stringify(data);
      const response = await axios.post(
        "http://localhost:8080/api/admin/send-newsletter",
        stringifiedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        alert("Successfully sent newsletter!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AdminTemplate>
      <>
        <h1>Newsletter Broadcaster</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={style.newsletterForm}>
          <TextField
            label="Newsletter Title"
            name="title"
            register={register}
            rules={{ required: "required*" }}
            type="text"
            key={"newsletter title"}
            error={errors.title}
          />
          <TextField
            label="Newsletter Content"
            name="content"
            register={register}
            rules={{ required: "required*" }}
            type="textarea"
            key={"newsletter content"}
            error={errors.content}
          />
          <button type="submit" className={style.broadcastButton}>
            Broadcast
          </button>
        </form>
      </>
    </AdminTemplate>
  );
}
