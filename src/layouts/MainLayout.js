// src/layouts/MainLayout.js
import Header from "./HeaderCustomer";
import { Outlet } from "react-router-dom";

export default function MainLayout(props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={props.searchQuery}
        setSearchQuery={props.setSearchQuery}
        setIsMobileMenuOpen={props.setIsMobileMenuOpen}
        isMobileMenuOpen={props.isMobileMenuOpen}
        handlerLogin={props.handleLogin}
        handlerLogout={props.handleLogout}
        authenticated={props.isAuthenticated}
        keycloakUserInfo={props.keycloakUserInfo}
      />
      <Outlet />
    </div>
  );
}
