
import NotFoundPage from "./Notfoundpage";

export default function Cacklogin({ element, path }) {
  const loggedInUser = JSON.parse(localStorage.getItem("user_sheet")) || null;


if (path === "/profire" && !loggedInUser) {
  return <NotFoundPage message="ທ່ານຕ້ອງ Login ກ່ອນ!" />;
}

if (path.startsWith("/admin") && (!loggedInUser || loggedInUser.status_user !== "admin")) {
  return <NotFoundPage message="ບໍ່ມີສິດເຂົ້າໃຊ້ໜ້າ Admin" />;
}

  

  return element;
}
