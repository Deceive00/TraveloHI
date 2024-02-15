import UserDataTable from "../../../components/Admin/UserDataTable/UserDataTable";
import AdminTemplate from "../../../templates/admin-template/admin-template";
export default function ManageUsers() {
  return (
    <AdminTemplate>
      <>
        <h1>Manage Users</h1>
        <UserDataTable />
      </>
    </AdminTemplate>
  );
}
