import SearchBar from "../shared/SearchBar";
import NavLink from "../shared/NavLink";
import ProfileDropdown from "./ProfileDropdown";

const DesktopMenu = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <NavLink linkTo="/">Lost Pet Registry</NavLink>
      </div>

      <div className="hidden md:flex flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
          </li>
          <li>
            <NavLink linkTo="/about">About</NavLink>
          </li>
          <li>
            <NavLink linkTo="/contact">Contact</NavLink>
          </li>
        </ul>
      </div>

      <ProfileDropdown />
    </div>
  );
};

export default DesktopMenu;
