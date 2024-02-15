import style from "./RoomForm.module.scss";
import UseFieldTextfield from "../form/UseFieldTextfield";
import { MdDelete } from "react-icons/md";
import MultipleFileInput from "../form/MultipleFileInput/MultipleFileInput";
interface RoomFormProps {
  index: number;
  register: any;
  removeRoom: any;
  errors: any;
  handleFileChange : any;
}
const rules = {
  roomName: {
    required: "required*",
  },
  roomPrice: {
    required: "required*",
    valueAsNumber: true,
    min: { value: 1, message: "Room price must be greater than 0" },
  },
  roomCapacity: {
    required: "required*",
    valueAsNumber: true,
    min: { value: 1, message: "Room capacity must be greater than 0" },
  },
  totalRooms:{
    required: "required*",
    valueAsNumber: true,
    min: { value: 1, message: "Total rooms must be greater than 0" },
  }
};
const RoomForm = ({ index, register, removeRoom, errors, handleFileChange }: RoomFormProps) => {
  return (
    <div className={style.roomContainer}>
      {
        index === 0 && (
          <h2>Hotel Rooms</h2>
        )
      }
      <div style={{display:'flex', gap:'0.5rem', alignItems:'center', justifyContent:'space-between'}}> 
        <h4>Room {index + 1}</h4>
        {index > 0 && (
          <span
            className={style.removeButton}
            onClick={() => removeRoom(index)}
          >
            <MdDelete width='100%' height='100%'/>
          </span>
        )}
      </div>
      <UseFieldTextfield
        label={`Room Name`}
        name={`rooms.${index}.roomName`}
        type="text"
        register={register(`rooms.${index}.roomName` as const, rules.roomName)}
        rules={rules.roomName}
        error={errors?.rooms?.[index]?.roomName}
      />
      <UseFieldTextfield
        label={`Room Price`}
        name={`rooms.${index}.roomPrice`}
        type="number"
        register={register(`rooms.${index}.roomPrice` as const, rules.roomPrice)}
        rules={rules.roomPrice}
        error={errors?.rooms?.[index]?.roomPrice}
      />
      <UseFieldTextfield
        label={`Room Capacity`}
        name={`rooms.${index}.roomCapacity`}
        type="number"
        register={register(`rooms.${index}.roomCapacity` as const, rules.roomCapacity)}
        rules={rules.roomCapacity}
        error={errors?.rooms?.[index]?.roomCapacity}
      />
      <UseFieldTextfield
        label={`Total Rooms`}
        name={`rooms.${index}.totalRooms`}
        type="number"
        register={register(`rooms.${index}.totalRooms` as const, rules.totalRooms)}
        rules={rules.totalRooms}
        error={errors?.rooms?.[index]?.totalRooms}
      />
      <div className={style.checkboxContainer}>
        <div key={`rooms.${index}.isRefundable`} className={style.checkboxItem}>
          <input
            type="checkbox"
            id={`rooms.${index}.isRefundable id`}
            {...register(`rooms.${index}.isRefundable` as const)}
          />
          <label htmlFor={`rooms.${index}.isRefundable id`}>
            Is Refundable
          </label>
        </div>
        <div key={`rooms.${index}.isSmoking`} className={style.checkboxItem}>
          <input
            type="checkbox"
            id={`rooms.${index}.isSmoking id`}
            {...register(`rooms.${index}.isSmoking` as const)}
          />
          <label htmlFor={`rooms.${index}.isSmoking id`}>Is Smoking</label>
        </div>
        <div
          key={`rooms.${index}.isReschedulable`}
          className={style.checkboxItem}
        >
          <input
            type="checkbox"
            id={`rooms.${index}.isReschedulable id`}
            {...register(`rooms.${index}.isReschedulable` as const)}
          />
          <label htmlFor={`rooms.${index}.isReschedulable id`}>
            Is Reschedulable
          </label>
        </div>
        <div key={`rooms.${index}.gotBreakfast`} className={style.checkboxItem}>
          <input
            type="checkbox"
            id={`rooms.${index}.gotBreakfast id`}
            {...register(`rooms.${index}.gotBreakfast` as const)}
          />
          <label htmlFor={`rooms.${index}.gotBreakfast id`}>
            Got Breakfast
          </label>
        </div>
        <div key={`rooms.${index}.gotFreeWifi`} className={style.checkboxItem}>
          <input
            type="checkbox"
            id={`rooms.${index}.gotFreeWifi id`}
            {...register(`rooms.${index}.gotFreeWifi` as const)}
          />
          <label htmlFor={`rooms.${index}.gotFreeWifi id`}>Got Free Wifi</label>
        </div>
      </div>
      <MultipleFileInput onFilesSelect={handleFileChange}/>
    </div>
  );
};

export default RoomForm;
