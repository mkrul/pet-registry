import { useRef, useState } from "react";
import NavLink from "../shared/NavLink";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";

const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end" ref={dropdownRef}>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
          onClick={handleToggle}
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className={`menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow ${
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
