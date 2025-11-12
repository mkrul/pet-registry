import { useRef, useState, useEffect } from "react";
import NavLink from "../common/NavLink";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../../features/auth/components/LogoutButton.jsx";
import { useSelector } from "react-redux";
import { useGetCurrentUserQuery, useLogoutMutation } from "../../../store/features/auth/authApiSlice.js";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dropdownRef = useRef(null);
  const isAuthenticated = useSelector((state) => !!state.auth.user);
  const { isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    const img = new Image();
    img.src = "/images/placeholder-blue.jpg";
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch (err) {
      window.location.href = "/login";
    }
  };

  if (isLoading || !isImageLoaded) {
    return (
      <div className="flex-none">
        <div className="w-11 h-11 rounded-full bg-base-200 animate-pulse"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end" ref={dropdownRef}>
        <button
          className="btn btn-ghost hover:bg-blue-300 dark:hover:bg-gray-700 btn-circle avatar sm:mr-2 dark:text-gray-200"
          onClick={handleToggle}
          data-testid="profile-button"
        >
          <div className="w-11 h-11 rounded-full">
            <img alt="User avatar" src="/images/placeholder-blue.jpg" className="object-cover w-full h-full" />
          </div>
        </button>
        <ul
          className={`menu menu-sm dropdown-content bg-white dark:bg-gray-700 rounded-box z-[50] mt-3 w-52 p-2 shadow dark:shadow-lg dark:border dark:border-gray-600 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <li className="hover:bg-base-200 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200">
            <NavLink linkTo="/dashboard">Dashboard</NavLink>
          </li>
          <li className="hover:bg-base-200 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200">
            <LogoutButton onCompleted={handleLogout} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
