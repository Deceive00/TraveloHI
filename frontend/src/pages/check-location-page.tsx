import { useEffect, useState } from "react";
import Uploader from "../components/location/uploader";
import Navbar from "../components/navigationbar/Navbar";
import Footer from "../components/footer/Footer";

export default function CheckLocationPage(){

  const [predict, setPredict] = useState(false);
  const onPredict = () => {
    setPredict(true);
  }
  const onNotPredict = () => {
    setPredict(false);
  }

  useEffect(() => {
    setPredict(false);
  }, []);

  return(
    <div className="check-location-body">
      <Navbar/>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100vw', height:'100vh', flexDirection:'column'}}>
        <Uploader onNotPredict={onNotPredict} onPredict={onPredict}/>
      </div>
      <Footer/>
    </div>
  )
}