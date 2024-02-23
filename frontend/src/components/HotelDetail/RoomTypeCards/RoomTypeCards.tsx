import { BiChevronRight } from 'react-icons/bi'
import style from './RoomTypeCard.module.scss'
import { IoIosBed } from "react-icons/io";
import { FaGift, FaTools, FaUserAlt } from 'react-icons/fa';
import { ROOM_FACILITIES } from '../../../utils/IconData';
import { IoIosGift } from "react-icons/io";
export default function RoomTypeCard({room} : {room : Room}){
  const getRefundableAndReschedulableStatus = () => {
    const reschedule = room.isReschedulable ? 'reschedule is not allowed' : 'reschedule is allowed';
    const refund = room.isRefundable?'Refund is not allowed' :'Refund is allowed';
    return refund + ' ' + reschedule;
  }
  const roomFacilities = [
    {
      name: room.gotBreakfast? 'Breakfast included' : 'Breakfast not included',
      icon: ROOM_FACILITIES('gotBreakfast')
    },
    {
      name: room.gotFreeWifi? 'Free Wi-Fi' : 'Free Wi-Fi Not Included',
      icon: ROOM_FACILITIES('gotFreeWifi')
    },
    {
      name: room.roomCapacity + ' guest',
      icon: <FaUserAlt/>
    },
    {
      name: room.roomBed,
      icon: <IoIosBed/>
    },

  ]
  return(
    <div className={style.container}>
      <div className={style.roomName}>
        <h4>{room.roomName}</h4>
        <BiChevronRight/>
      </div>
      <p className={style.roomStatus}>{getRefundableAndReschedulableStatus()}</p>
      <div className={style.divider}></div>
      <div className={style.facilityAndPriceContainer}>
        <div className={style.facilityContainer}>
          {
            roomFacilities.map((item : any, index : number) => (
              <div className={style.roomFacilitiesList} key={index}>
                {item.icon}
                <p>{item.name}</p>
              </div>
            ))
          }
          <div className={style.roomFacilitiesList}>
            <FaTools width={`calc(10px + 0.2vw)`} height={`calc(10px + 0.2vw)`}/>
            <p>Parking, Coffee & tea, Drinking water, Free fitness center access</p>
          </div>
        </div>
        <div className={style.priceContainer}>
          <h3>$ {room.roomPrice}</h3>
          <p>/room/night (include taxes)</p>
          <div className={style.points}>
            <img src="https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-mobile/test-discovery/2023/08/09/f076ba41-0d02-429b-ab6b-ffb8f8bf1b2a-1691548794692-f971249bfad90c191e51ee1e4da087f8.png" alt="" />
            <p>Up to {room.roomPrice * 0.1} points</p>
          </div>
          <div className={style.bookButtonContainer}>
            <button className={style.bookButton}>Book</button>
          </div>
        </div>
      </div>
    </div>
  )
}