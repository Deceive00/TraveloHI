import { useNavigate } from "react-router-dom";
import { IChildren } from "../../interface/children-interface";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";
import Loading from "../Loading/Loading";

export default function Middleware({ children }: { children: React.ReactNode }) {
  const duration = 3000;
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const timer = setTimeout(() => {
          navigate("/login");
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading/>
      </div>
    );
  }
  if (!loading && !user) {
    return <h1>GA BOLEH</h1>;
  }
  else{
    if(!user) navigate('/login');
    return <>{children}</>;
  }

}
