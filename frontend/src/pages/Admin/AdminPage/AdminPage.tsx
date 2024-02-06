
import style from "./AdminPage.module.scss";
import { ADMIN_MENU } from "../../../utils/Items";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
export default function AdminPage() {

  return (
    <div className={style.container}>
      <AdminSidebar/>
    </div>
  );
}
