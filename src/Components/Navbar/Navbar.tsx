import { Avatar } from "@heroui/react";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@heroui/react";
import { UserTokenContext } from "../../Context/AuthUserContext";

export type UserData = {
  _id: string;
  name: string;
  email: string;
  photo: string;
};

export default function Navbar() {
  const [isUserDataOpen, setIsUserDataOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { userData, setUserData } = useContext(UserTokenContext) as {
    userData: UserData | null;
    setUserData: (userData: UserData | null) => void;
  };

  const navigate = useNavigate();
  function logOut() {
    localStorage.removeItem("tkn");
    setUserData(null);
    navigate("/login");
    setIsUserDataOpen(false);
  }

  return (
    <nav className="bg-[E8F5E9] w-full z-50 top-0 inset-s-0 border-2 relative ">
      <div className={`max-w-7xl flex ${userData? "flex-wrap" : "flex-nowrap"} items-center justify-between mx-auto p-4`}>
        <Link
          to="/posts"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/logo2.png" className="h-7 md:h-10" alt="Flowbite Logo" />
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap text-main-color">
            Social App
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {userData ? (
            <button
              onClick={(_) => setIsUserDataOpen(!isUserDataOpen)}
              type="button"
              className="flex text-sm bg-neutral-primary ring-2 ring-main-color rounded-full md:me-0 focus:ring-2 focus:ring-green-800"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <Avatar>
                <Avatar.Image alt={userData.name} src={userData.photo} />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
            </button>
          ) : (
            <div className="flex gap-2 md:gap-4 ms-0 md:ms-2 w-35 md:w-fit">
              <Link to="/login" className="group">
                <Button className="bg-main-color group-hover:bg-transparent group-hover:text-main-color border-2 border-transparent group-hover:border-main-color transition-all duration-300 pointer-events-none">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="group">
                <Button className="bg-transparent text-main-color border-2 border-main-color group-hover:bg-main-color group-hover:text-white transition-all duration-300 pointer-events-none">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Dropdown menu */}
          <div
            className={`z-50  absolute top-full right-0 ${isUserDataOpen ? "block" : "hidden"} bg-white border border-default-medium rounded-base shadow-lg w-44`}
            id="user-dropdown"
          >
            <div className="px-4 py-3 text-sm border-b border-default">
              <span className="block text-heading font-medium">
                {userData?.name}
              </span>
              <span className="block text-body truncate">
                {userData?.email}
              </span>
            </div>
            <ul
              className="p-2 text-sm text-body font-medium"
              aria-labelledby="user-menu-button"
            >
              <li className="inline-flex items-center w-full p-2 hover:bg-gray-200/50 duration-300 transition-all rounded">
                <Link to="/profilePage">My Profile</Link>
              </li>
              <li className="inline-flex items-center w-full p-2 hover:bg-gray-200/50 duration-300 transition-all rounded">
                <Link to="/changePassword">Change Password</Link>
              </li>
              <li
                onClick={(_) => {
                  logOut();
                }}
                className="inline-flex items-center w-full p-2 cursor-pointer hover:bg-gray-200/50 duration-300 transition-all rounded"
              >
                Sign out
              </li>
            </ul>
          </div>

          {userData && (
            <button
              onClick={(_) => setIsOpen(!isOpen)}
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          )}
        </div>
        <div
          className={`items-center justify-between ${isOpen ? "flex" : "hidden"} w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default w-full lg:me-40 rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
            {userData && (
              <>
                <li>
                  <NavLink
                    to="/posts"
                    className="block py-2 px-3 text-main-color rounded-2xl bg-[#E8F5E9] hover:bg-green-600 hover:text-white transition-colors duration-300  md:text-fg-brand md:m-0 mb-3"
                    aria-current="page"
                  >
                    Posts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profilePage"
                    className="block py-2 px-3 text-main-color rounded-2xl bg-[#E8F5E9] hover:bg-green-600 hover:text-white transition-colors duration-300  md:text-fg-brand "
                    aria-current="page"
                  >
                    My Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
