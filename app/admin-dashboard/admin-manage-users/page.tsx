import ManageUser from "./adminManage";
import AddUser  from "./add-user/adminAddUser";

export default function Page() {
  return <ManageUser />;
}

export  function addUser() {
  return <AddUser />;
}