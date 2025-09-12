import { Link } from "react-router-dom";
import ProfileDropdown from "../main/ProfileDropdown";
import NavLink from "./NavLink";

const NavBar = () => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.replace(window.location.origin);
  };

  return (
    <nav className="bg-page">
      <div data-testid="navbar">
        {/* Main Navbar */}
        <div className="navbar">
          <div className="flex-1">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="btn btn-ghost text-xl hover:bg-transparent"
            >
              Lost Pet Registry
            </Link>
          </div>

          {/* Navigation for larger screens (850px+) */}
          <div className="hidden md:flex flex-none">
            <ul
              className="menu menu-horizontal [&>li>a]:px-[0.75rem]"
              data-testid="desktop-nav"
              aria-label="desktop navigation"
            >
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

          {/* Navigation for tablet sizes (640px-849px) */}
          <div className="hidden sm:flex md:hidden flex-none">
            <ul
              className="menu menu-horizontal [&>li>a]:px-[0.75rem]"
              data-testid="tablet-nav"
              aria-label="tablet navigation"
            >
              <li>
                <NavLink linkTo="/reports/new">Report</NavLink>
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

        {/* Navigation for mobile devices (below 640px) */}
        <div className="sm:hidden w-full px-4 mt-2 mb-5 text-center">
          <ul
            className="flex justify-center space-x-[0.75rem]"
            data-testid="mobile-nav"
            aria-label="mobile navigation"
          >
            <li>
              <NavLink linkTo="/reports/new">Report</NavLink>
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
    </nav>
  );
};

export default NavBar;
