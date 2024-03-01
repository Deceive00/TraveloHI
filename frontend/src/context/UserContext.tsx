import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface IUserContextProps {
  user: IUser | null;
  refetch: () => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<IUserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refetch = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setUser(null);
        Cookies.remove("jwt");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchUser = async () => {
    const jwt = Cookies.get("jwt");
    setLoading(true);
    if (!jwt) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/getuser", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const userData = response.data;
        setUser({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          dob: userData.dob,
          isSubscribe: userData.isSubscribe,
          gender: userData.gender,
          status: userData.status,
          securityQuestions: userData.securityQuestions,
          profilePicture: userData.profilePicture,
        });
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ user, refetch, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
