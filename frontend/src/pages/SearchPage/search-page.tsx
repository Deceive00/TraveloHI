import axios from "axios";
import Navbar from "../../components/navigationbar/Navbar";
import style from './search-page.module.scss'
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
export default function SearchPage(){
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term") || ""; 
    setSearchTerm(term);
    if (term) {
      fetchSearchResults(term);
    }
  }, [location.search]); 

  const fetchSearchResults = async (term : string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/search`, {
        params: { term },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return(
  <div className={style.body}>
    <Navbar/>
    <div className={style.container}>

    </div>
  </div>
  )
}