import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ProfileDropdown from "../main/ProfileDropdown";
import NavLink from "./NavLink";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.replace(window.location.origin);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-page">
      <div data-testid="navbar">
        {/* Main Navbar */}
        <div className="navbar">
          {/* Hamburger Menu for Mobile/Tablet */}
          <div className="flex-none sm:hidden">
            <div className="dropdown" ref={menuRef}>
              <button
                className="btn btn-ghost btn-circle"
                onClick={handleMenuToggle}
                data-testid="hamburger-menu-button"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <ul
                className={`menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow ${
                  isMenuOpen ? "block" : "hidden"
                }`}
                data-testid="mobile-menu"
              >
                <li className="hover:bg-base-200 rounded-lg transition-colors duration-200">
                  <NavLink linkTo="/reports/new" handler={() => setIsMenuOpen(false)}>Report</NavLink>
                </li>
                <li className="hover:bg-base-200 rounded-lg transition-colors duration-200">
                  <NavLink linkTo="/reports" handler={() => setIsMenuOpen(false)}>Search</NavLink>
                </li>
                <li className="hover:bg-base-200 rounded-lg transition-colors duration-200">
                  <NavLink linkTo="#" handler={() => setIsMenuOpen(false)}>About</NavLink>
                </li>
                <li className="hover:bg-base-200 rounded-lg transition-colors duration-200">
                  <NavLink linkTo="#" handler={() => setIsMenuOpen(false)}>Contact</NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="btn btn-ghost text-xl hover:bg-transparent pl-1 sm:pl-4"
            >
              Lost Pets Registry
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
      </div>
    </nav>
  );
};

export default NavBar;
