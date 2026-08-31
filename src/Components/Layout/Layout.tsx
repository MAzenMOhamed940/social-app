import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E8F5E9] flex justify-center items-center">
        <Outlet />
        <Toaster/>
      </div>
    </>
  );
}


