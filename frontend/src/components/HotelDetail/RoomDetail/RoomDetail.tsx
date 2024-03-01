import style from "./RoomDetail.module.scss";
import { SlSizeActual } from "react-icons/sl";
import { TbAirConditioning } from "react-icons/tb";
import { ROOM_FACILITIES } from "../../../utils/IconData";
import RoomTypeCard from "../RoomTypeCards/RoomTypeCards";
import { useCallback, useRef } from "react";
import { useInView } from 'react-intersection-observer';
export default function RoomDetail({ room, handleCart }: { room: Room , handleCart: (room : Room) => void}) {
  const ref = useRef();

  const { ref: leftContainerRef, inView: isFixed } = useInView({
    threshold:1,
    rootMargin:`1000px 0px 0px`
  })
  const setRefs = useCallback(
    (node : any) => {

      ref.current = node;
     
      leftContainerRef(node);
    },
    [leftContainerRef],
  );
  return (
    <div className={style.container}>
      <h3>{room.roomName}</h3>
      <div className={style.content}>
        <div className={style.leftContainer}>
          <div
            className={style.leftContent}
            // style={{
            //   position: isFixed ? "fixed" : "static",
            //   top: isFixed ? "15vh" : "auto",
            // }}
            ref={setRefs}
          >
            <div className={style.imageContainer}>
              <img src={room?.roomPicture[0]} alt="" />
            </div>
            <div className={style.leftContentBottom}>
              <div className={style.roomSize}>
                <SlSizeActual />
                <p>
                  {room.roomSize}m<sup>2</sup>
                </p>
              </div>
              <div className={style.divider}></div>
              <div className={style.roomGeneralInformation}>
                <div className={style.generalInfoContainer}>
                  <TbAirConditioning />
                  <p>AC</p>
                </div>
                {room.gotFreeWifi && (
                  <div className={style.generalInfoContainer}>
                    {ROOM_FACILITIES("gotFreeWifi")}
                    <p>Free Wi-Fi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={style.rightContainer}>
          <RoomTypeCard room={room} handleCart={handleCart}/>
          <RoomTypeCard room={room} handleCart={handleCart}/>
          <RoomTypeCard room={room} handleCart={handleCart}/>
        </div>
      </div>
    </div>
  );
}
