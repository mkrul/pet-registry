import React from "react";
import { Link } from "react-router-dom";
import NavLink from "./shared/NavLink";
import SearchBar from "./shared/SearchBar";

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
          <div className="align-right hidden lg:flex">
            <SearchBar />
          </div>
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
            </li>
            <li>
              <NavLink linkTo="#">About</NavLink>
            </li>
            <li>
              <NavLink linkTo="#">Contact</NavLink>
            </li>
          </ul>
        </div>

        {/* Profile Dropdown */}
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink linkTo="#">My Reports</NavLink>
              </li>
              <li>
                <NavLink linkTo="#">My Pets</NavLink>
              </li>
              <li>
                <NavLink linkTo="#">
                  Profile <span className="badge">New</span>
                </NavLink>
              </li>
              <li>
                <NavLink linkTo="#">Settings</NavLink>
              </li>
              <li>
                <NavLink linkTo="#">Logout</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation for smaller devices */}
      <div className="md:hidden w-full px-4 mt-2 mb-5 text-center">
        <ul className="flex justify-center space-x-6">
          <li>
            <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
          </li>
          <li>
            <NavLink linkTo="#">About</NavLink>
          </li>
          <li>
            <NavLink linkTo="#">Contact</NavLink>
          </li>
        </ul>
      </div>

      {/* Full-width SearchBar for small screens */}
      <div className="lg:hidden w-full px-4 mt-3 mb-5">
        <SearchBar />
      </div>
    </div>
  );
};

export default NavBar;
