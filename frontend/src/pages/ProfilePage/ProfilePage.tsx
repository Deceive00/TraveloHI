import { useForm } from "react-hook-form";
import Middleware from "../../components/auth/Middleware";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navigationbar/Navbar";
import style from "./profilepage.module.scss";
import ProfilePicture from "../../components/form/ProfilePicture";
import { rules, uploadImage } from "../../utils/utils";
import { useUser } from "../../context/UserContext";
import ShieldIcon from "/images/shield.png";
import TextField from "../../components/form/Textfield";
import SwitchToggle from "../../components/form/Switch/Switch";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Loading from "../../components/Loading/Loading";
import Snackbar from "../../components/form/Snackbar";
import SettingSidebar from "../../components/SettingSidebar/SettingSidebar";
export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubscribe, setIsSubscribe] = useState<boolean | undefined>(false);
  const { user, refetch } = useUser();
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => setIsSubscribe(user?.isSubscribe), [user]);
  const onSubmit = async (data: any, e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      let downloadURL;
      if (data.profilePicture) {
        const ext = data.profilePicture.name.split(".")[1];
        console.log(data.profilePicture.name);
        const emailValue = data.email;
        const filename = `profilepicture/${emailValue}_profilepicture.${ext}`;

        downloadURL = await uploadImage(filename, data.profilePicture);
      } else {
        downloadURL = user?.profilePicture;
      }

      const { profilePicture: profilePicture, ...pureData } = data;
      const stringifiedData = JSON.stringify({
        ...pureData,
        profilePicture: downloadURL,
        isSubscribe: isSubscribe,
      });

      const response = await axios.post(
        "http://localhost:8080/api/update-profile",
        stringifiedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        await refetch();
        console.log("Updated");
        setSnackbarMessage(response.data.message);
        setSnackbarType("success");
        setSnackbarOpen(true);
      } else {
        console.error("Update failed: ", response.statusText);
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
          console.error("Update failed:", responseData.error);
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
    <Middleware>
      <Navbar />
      <div className={style.profilePageContent}>
        <div className={style.profilePageContainer}>
          <SettingSidebar />
          <div className={style.rightProfilePageContainer}>
            {loading && (
              <div>
                <Loading />
              </div>
            )}
            {!loading && (
              <div className={style.rightContentContainer}>
                <div className={style.pageTitleContainer}>
                  <div className={style.circularContainer}>
                    <img src={ShieldIcon} alt="shield" />
                  </div>
                  <div className={style.pageTextTitleContainer}>
                    <h1>Personal Information</h1>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Sapiente ipsa dolorum quibusdam? Expedita odit, quisquam
                      quae ullam reiciendis voluptatum itluptas eum!
                    </p>
                  </div>
                </div>
                {/* <div style={{ height: "2vh" }}></div>
              <hr />
              <div style={{ height: "2vh" }}></div> */}

                <form
                  className={style.profileForm}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div style={{ height: "2vh" }}></div>
                  <ProfilePicture
                    label={"profilePicture"}
                    error={errors.profilePicture}
                    rules={rules.profilePicture}
                    register={register}
                    className="profilepage-picture"
                    currentImg={user?.profilePicture}
                  />
                  <div className="name-container" style={{ marginTop: "2vh" }}>
                    <div className="first-name-container">
                      <TextField
                        label="First Name"
                        name="firstName"
                        type="text"
                        register={register}
                        rules={rules.name}
                        error={errors.firstName}
                        defaultValue={user?.firstName}
                      />
                    </div>
                    <div className="last-name-container">
                      <TextField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        register={register}
                        rules={rules.name}
                        error={errors.lastName}
                        defaultValue={user?.lastName}
                      />
                    </div>
                  </div>
                  <div>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      register={register}
                      rules={rules.email}
                      error={errors.email}
                      defaultValue={user?.email}
                    />
                  </div>
                  <div className={style.halfContainer}>
                    <div className={style.halfContentContainer}>
                      <TextField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        register={register}
                        rules={rules.dob}
                        error={errors.dob}
                        defaultValue={user?.dob}
                      />
                    </div>
                    <div className={`${style.halfContentContainer}`}>
                      <label>Gender</label>
                      <div className="gender-container">
                        <label className="form-control">
                          <input
                            type="radio"
                            {...register("gender", rules.gender)}
                            value={"Male"}
                            defaultChecked={user?.gender === "Male"}
                          />
                          Male
                        </label>

                        <label className="form-control">
                          <input
                            type="radio"
                            {...register("gender", rules.gender)}
                            value={"Female"}
                            defaultChecked={user?.gender === "Female"}
                          />
                          Female
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={style.subscribeContainer}>
                    <SwitchToggle
                      initialValue={user?.isSubscribe}
                      onChange={setIsSubscribe}
                    />
                    <label htmlFor="toggle-btn">Newsletter Subscription</label>
                  </div>
                  <div className={style.saveButtonContainer}>
                    <button type="submit" className={style.saveButton}>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Snackbar
        message={snackbarMessage}
        type={snackbarType}
        show={snackbarOpen}
        setShow={setSnackbarOpen}
      />
      <Footer />
    </Middleware>
  );
}
