import { Navigate, Outlet } from "react-router-dom";
import AdminSideNav from "./Admin/Components/AdminSideNav";
import StaffSideNav from "./Staff/Components/StaffSideBar";
import StudentSideNav from "./Student/Components/StudentSideNav";

const navigationByRole = { "1": AdminSideNav, "2": StaffSideNav, "3": StudentSideNav };

const PrivateLayout = () => {
  const role = localStorage.getItem("role");
  const Navigation = navigationByRole[role];
  if (!localStorage.getItem("access_token") || !Navigation) return <Navigate to="/login" replace />;

  return <div className="d-lg-flex d-md-block d-sm-block"><Navigation /><main className="flex-grow-1"><Outlet /></main></div>;
};

export default PrivateLayout;
