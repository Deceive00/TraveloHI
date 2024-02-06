import UserDataTable from "../../../components/Admin/UserDataTable/UserDataTable";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import style from './ManageUsers.module.scss'
export default function ManageUsers(){
  return (
    <div className={style.container}>
      <AdminSidebar/>
      <div className={style.content}>
        <h1>Manage Users</h1>
        <UserDataTable/>
      </div>
    </div>
  );
}