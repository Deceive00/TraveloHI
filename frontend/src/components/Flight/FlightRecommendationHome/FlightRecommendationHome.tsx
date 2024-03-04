import { useEffect, useState } from 'react'
import style from './FlightRecommendationHome.module.scss'
import FlightRecommendationCard from '../FlightRecommendationCard/FlightRecommendationCard';
import { getAllData } from '../../../utils/utils';

export default function FlightRecommendationHome(){

  const [flightData, setFlightData] = useState<IFlightData[]>([]);
  useEffect(() => {
    getAllData('/flights', setFlightData);

  }, []);
  console.log(flightData)

  return(
    <div className={style.container}>
      {
        flightData?.map((data : IFlightData, index) => {
          return<FlightRecommendationCard flightData={data} key={index}/>
        })
      }
    </div>
  )
}