import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ToastManager from "./ToastManager";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-primary overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <ToastManager />
    </div>
  );
};

export default Layout;
