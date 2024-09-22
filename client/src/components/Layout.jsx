import NavBar from "./NavBar";
import "../styles/layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default Layout;
