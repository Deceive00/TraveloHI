import Navbar from "../components/navigationbar/Navbar";
import { IChildren } from "../interface/children-interface";

export default function MainTemplate({ children }: IChildren) {
  return (
    <div>
      <Navbar />
      <div className="page-container">{children}</div>
    </div>
  );
}
