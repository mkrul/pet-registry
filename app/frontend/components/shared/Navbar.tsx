import { Link } from "react-router-dom";
import ProfileDropdown from "../main/ProfileDropdown";
import NavLink from "./NavLink";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      {/* Main Navbar */}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl hover:bg-transparent">
            National Lost Pet Registry
          </Link>
        </div>

        {/* Navigation for larger screens */}
        <div className="hidden md:flex flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
            </li>
            <li>
              <NavLink linkTo="/reports">Search</NavLink>
            </li>
            <li>
              <NavLink linkTo="#">About</NavLink>
            </li>
            <li>
              <NavLink linkTo="#">Contact</NavLink>
            </li>
          </ul>
        </div>

        <ProfileDropdown />
      </div>

      {/* Navigation for smaller devices */}
      <div className="md:hidden w-full px-4 mt-2 mb-5 text-center">
        <ul className="flex justify-center space-x-6">
          <li>
            <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
          </li>
          <li>
            <NavLink linkTo="/reports">Search</NavLink>
          </li>
          <li>
            <NavLink linkTo="#">About</NavLink>
          </li>
          <li>
            <NavLink linkTo="#">Contact</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
