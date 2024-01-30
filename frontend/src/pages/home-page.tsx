
import { useEffect } from "react"
import { useUser } from "../context/UserContext";
import Navbar from "../components/navigationbar/Navbar";

export default function HomePage(){
  const { user } = useUser();
  useEffect(() => {
    console.log('concon')
  }, [])

  return (
    <>
      <Navbar/>
      <div>
        {user?.email}
      </div>
    </>

  )
}