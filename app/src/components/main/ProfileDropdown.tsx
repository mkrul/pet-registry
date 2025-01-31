import { useRef, useState } from "react";
import NavLink from "../common/NavLink";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetCurrentUserQuery } from "../../redux/features/auth/authApiSlice";

const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);

  // Check current user on mount
  useGetCurrentUserQuery();

  const handleToggle = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink linkTo="/login" data-testid="nav-link-login">
              Log In
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end" ref={dropdownRef}>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost hover:bg-blue-200 btn-circle avatar"
          onClick={handleToggle}
          data-testid="profile-button"
        >
          <div className="w-10 rounded-full">
            <img alt="User avatar" src="/images/placeholder-blue.jpg" className="object-cover" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className={`menu menu-sm dropdown-content bg-blue-200 rounded-box z-[1] mt-3 w-52 p-2 shadow ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <li className="hover:bg-base-100 rounded-lg transition-colors duration-200">
            <NavLink>My Reports</NavLink>
          </li>
          <li className="hover:bg-base-100 rounded-lg transition-colors duration-200">
            <NavLink>My Pets</NavLink>
          </li>
          <li className="hover:bg-base-100 rounded-lg transition-colors duration-200">
            <NavLink>Profile</NavLink>
          </li>
          <li className="hover:bg-base-100 rounded-lg transition-colors duration-200">
            <NavLink>Settings</NavLink>
          </li>
          <li className="hover:bg-base-100 rounded-lg transition-colors duration-200">
            <LogoutButton onCompleted={() => navigate("/login")} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
