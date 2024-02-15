import { useFieldArray, useForm } from "react-hook-form";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import style from "./manage-hotel-page.module.scss";
import TextField from "../../../components/form/Textfield";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Snackbar from "../../../components/form/Snackbar";
import ComboBox from "../../../components/form/ComboBox/Combobox";
import MultipleFileInput from "../../../components/form/MultipleFileInput/MultipleFileInput";
import { uploadImage } from "../../../utils/utils";
import RoomForm from "../../../components/RoomForm/RoomForm";
import AdminTemplate from "../../../templates/admin-template/admin-template";

interface Room {
  roomId: string;
  roomName: string;
  roomPrice: number;
  roomCapacity: number;
  isRefundable: boolean;
  isSmoking: boolean;
  isReschedulable: boolean;
  gotBreakfast: boolean;
  gotFreeWifi: boolean;
}
interface ManageHotelForm {
  hotelName: string;
  hotelDescription: string;
  hotelAddress: string;
  hotelRating: number;
  city: string;
  rooms: Room[];
}
const roomDefaultValue = {
  roomName: "",
  roomPrice: 0,
  roomCapacity: 0,
  isRefundable: false,
  isSmoking: false,
  isReschedulable: false,
  gotBreakfast: false,
  gotFreeWifi: false,
};

export default function ManageHotelPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm<ManageHotelForm>({
    defaultValues: {
      rooms: [roomDefaultValue],
    },
  });
  const { fields, append, remove } = useFieldArray<
    ManageHotelForm,
    "rooms",
    "roomId"
  >({
    name: "rooms",
    control,
    keyName: "roomId",
  });
  const [snackbarType, setSnackbarType] = useState("error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [hotelImages, setHotelImages] = useState([]);
  const [roomImages, setRoomImages] = useState<any[]>([]);

  const addRoom = () => {
    const item = { roomId: fields.length.toString(), ...roomDefaultValue };
    append(item);
    setRoomImages([...roomImages, []]);
  };

  const removeRoom = (index: number) => {
    remove(index);
    setRoomImages(roomImages.filter((_, i) => i !== index));
  };

  const handleHotelImageChange = (files: any) => {
    setHotelImages(files);
  };
  const handleRoomImageChange = (files: any, roomIndex: number) => {
    const updatedRoomImagesArray = [...roomImages];
    updatedRoomImagesArray[roomIndex] = files;
    setRoomImages(updatedRoomImagesArray);
  };
  const hotelRules = {
    hotelName: {
      required: "required*",
    },
    hotelAddress: {
      required: "required*",
    },
    hotelDescription: {
      required: "required*",
    },
    city: {
      required: "required*",
      // validate: (value: string) => {
      //   console.log(value)
      //   console.log(cities.includes(value));
      //   if(cities.includes(value)) {
      //     return true;
      //   } else{
      //     return 'Please select a valid city'
      //   }
      // },
      // message: "Please select a valid city.",
    },
  };

  const showSnackbar = (message: string, type: string) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<any[]>([]);

  const handleCheckboxChange = (event: any) => {
    const facilityId = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedFacilityIds([...selectedFacilityIds, facilityId]);
    } else {
      setSelectedFacilityIds(
        selectedFacilityIds.filter((id) => id !== facilityId)
      );
    }
  };
  const fetchData = async (
    setLoading: any,
    showSnackbar: any,
    endpoint: any
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/${endpoint}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await response.data;
      if (response.status === 200) {
        return data;
      } else {
        showSnackbar("Error fetching data", "error");
        return null;
      }
    } catch (error) {
      showSnackbar("Error fetching data", "error");
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const fetchCity = async () => {
    const data = await fetchData(
      setLoading,
      showSnackbar,
      "admin/get-all-city"
    );
    if (data) {
      setCities(data.cities.map((d: any) => d.fullName));
    }
  };

  const fetchFacility = async () => {
    const data = await fetchData(
      setLoading,
      showSnackbar,
      "admin/get-all-facility"
    );
    if (data) {
      setFacilities(
        data.facilities.map((facility: any) => ({
          id: facility.ID,
          name: facility.facilityName,
        }))
      );
    }
  };

  const onSubmit = async (data: any) => {
    if (hotelImages.length <= 0) {
      showSnackbar("Please insert hotel images", "error");
      return;
    }
    for (const roomImg of roomImages) {
      if (roomImg.length == 0) {
        showSnackbar("Please insert room images", "error");
        return;
      }
    }

    if (selectedFacilityIds.length <= 0) {
      showSnackbar("Please select hotel facilities", "error");
      return;
    }

    const cityID = cities.indexOf(data.city) + 1;
    const hotelPictures = await Promise.all(
      hotelImages.map(async (file: File, index: number) => {
        const ext = file.name.split(".")[1];
        const hotelName = data.hotelName;
        const filename = `hotel/hilton//hotelImages/${hotelName}/${hotelName}${index}.${ext}`;
        return await uploadImage(filename, file);
      })
    );
    const roomsWithPictures = [];
    for (let index = 0; index < data.rooms.length; index++) {
      const room = data.rooms[index];
      const roomPictures = [];
      for (
        let fileIndex = 0;
        fileIndex < roomImages[index].length;
        fileIndex++
      ) {
        const file = roomImages[index][fileIndex];
        const ext = file.name.split(".")[1];
        const filename = `hotel/hilton/roomImages/${room.roomName}/${room.roomName}${fileIndex}.${ext}`;
        roomPictures.push(uploadImage(filename, file));
      }
      const pictures = await Promise.all(roomPictures);
      roomsWithPictures.push({ ...room, roomPicture: pictures });
    }

    const { city: city, rooms: rooms, ...pureData } = data;
    const convertedFacilityIds = selectedFacilityIds.map((id) =>
      parseInt(id, 10)
    );
    const stringifiedData = JSON.stringify({
      ...pureData,
      facilityId: convertedFacilityIds,
      cityID: cityID,
      hotelPicture: hotelPictures,
      rooms: roomsWithPictures,
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/insert-hotel",
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
        return;
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
          console.error("Registration Failed:", responseData.error);
          showSnackbar(responseData.error as string, "error");
        }
      }
    }
  };

  useEffect(() => {
    fetchCity();
    fetchFacility();
  }, []);

  return (
    <AdminTemplate>
      <>
        <h1>Manage Hotels</h1>
        <form
          className={style.formContainer}
          style={{ marginTop: "2vh" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={style.hotelForm}>
            <h2>Hotel Details</h2>
            <div>
              <TextField
                label="Hotel Name"
                name="hotelName"
                type="text"
                register={register}
                rules={hotelRules.hotelName}
                error={errors.hotelName}
              />
            </div>
            <div>
              <TextField
                label="Hotel Address"
                name="hotelAddress"
                type="text"
                register={register}
                rules={hotelRules.hotelAddress}
                error={errors.hotelAddress}
              />
            </div>
            <div>
              <TextField
                label="Hotel Description"
                name="hotelDescription"
                type="text"
                register={register}
                rules={hotelRules.hotelDescription}
                error={errors.hotelDescription}
              />
            </div>
            <div>
              <ComboBox
                label="City"
                name="city"
                options={cities}
                register={register}
                rules={hotelRules.city}
                error={errors.city}
                setValue={setValue}
              />
            </div>
            <div>
              <MultipleFileInput onFilesSelect={handleHotelImageChange} />
            </div>
            <div>
              <div>
                <h2>Facilities</h2>
                <div className={style.facilityContainer}>
                  {facilities.map((facility, index) => (
                    <div key={index} className={style.facilityItem}>
                      <input
                        type="checkbox"
                        id={`facility-${facility.id}`}
                        value={facility.id}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={`facility-${facility.id}`}>
                        {facility.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className={style.insertButton}>
              Insert Hotel
            </button>
          </div>

          <div className={style.roomFormContainer}>
            <div className={style.rooms}>
              {fields.map((item, index) => {
                return (
                  <>
                    <RoomForm
                      errors={errors}
                      index={index}
                      register={register}
                      removeRoom={removeRoom}
                      key={item.roomId}
                      handleFileChange={(files: any) =>
                        handleRoomImageChange(files, index)
                      }
                    />
                  </>
                );
              })}
            </div>
            <button type="button" onClick={addRoom} className={style.addButton}>
              Add Room
            </button>
          </div>
        </form>
        <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          show={snackbarOpen}
          setShow={setSnackbarOpen}
        />
      </>
    </AdminTemplate>
  );
}
