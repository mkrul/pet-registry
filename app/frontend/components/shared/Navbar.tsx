import { Link } from "react-router-dom";
import ProfileDropdown from "../main/ProfileDropdown";
import NavLink from "./NavLink";

const NavBar = () => {
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
