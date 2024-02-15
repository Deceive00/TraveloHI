
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { IChildren } from "../../interface/children-interface";
import style from './admin-template.module.scss'
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminTemplate({children} : IChildren){
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const middleware = async () => {
      try{
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/admin/validate-admin-credentials', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        if(response.status === 200){
          console.log(response.data.message)
          setIsAuthorized(true);
        }
      }catch(error){
        console.log("You are not authorized");
        setIsAuthorized(false);
        navigate('/');
        return;
      } finally{
        setLoading(false);
      }
    }
    middleware();
  }, [])
  if (loading) {
    return <Loading/>
  }
  if(!isAuthorized) navigate('/');
  return (
    <div className={style.container}>
      <AdminSidebar/>
      <div className={style.content}>
        {children}
      </div>
    </div>
  )
}