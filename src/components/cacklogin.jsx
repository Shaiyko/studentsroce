import { Outlet, useLocation } from "react-router-dom";
import NotFoundPage from "./Notfoundpage";


export default function Cacklogin({ element, children }) {
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem("user_sheet")) || null;
  const path = location.pathname;

  // Check for profile page access
  if (path === "/profire" && !loggedInUser) {
    return <NotFoundPage message="ທ່ານຕ້ອງ Login ກ່ອນ!" />;
  }

  // Check for admin page access
  if (path.startsWith("/admin") && (!loggedInUser || loggedInUser.status_user !== "admin")) {
    return <NotFoundPage message="ບໍ່ມີສິດເຂົ້າໃຊ້ໜ້າ Admin" />;
  }

  // If element prop is provided (for single route protection), render it
  if (element) {
    return element;
  }

  // If children are provided, render them
  if (children) {
    return children;
  }

  // For nested routes, use Outlet
  return <Outlet />;
}