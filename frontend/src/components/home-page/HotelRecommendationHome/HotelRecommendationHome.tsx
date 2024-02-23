import { useEffect, useState } from 'react'
import style from './HotelRecommendationHome.module.scss'
import axios from 'axios';
import HotelRecommendationHomeCard from './HotelRecommendationHomeCard/HotelRecommendationHomeCard';

export default function HotelRecommendationHome(){
  const [hotels, setHotels] = useState<Hotel[]>([]);
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get-recommendation-hotel", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          const hotelData = response.data.hotels;
          const updatedHotels = hotelData.map((hotel: any) => {
            return {
              hotelId: hotel.id,
              hotelName: hotel.hotelName,
              hotelDescription: hotel.hotelDescription,
              hotelRating: hotel.overallRating,
              hotelPicture: hotel.hotelPicture,
              hotelAddress: hotel.hotelAddress,
              hotelImage: hotel.hotelPicture,
              city: hotel.City.cityName,
              country: hotel.City.Country.countryName,
            };
          });
          setHotels(updatedHotels);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchHotel();
  }, [])
  useEffect(() => console.log(hotels), [hotels])
  return(
    <div className={style.container}>
      {
        hotels.map((hotel: Hotel) => {
          return (
            <HotelRecommendationHomeCard hotel={hotel} key={hotel.hotelId}/>
          )
        })
      }
    </div>
  )
}