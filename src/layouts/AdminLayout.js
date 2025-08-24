// src/layouts/AdminLayout.js
import { Outlet } from "react-router-dom";
import HeaderAdmin from "./HeaderAdimin";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin></HeaderAdmin>
      <Outlet />
    </div>
  );
}
