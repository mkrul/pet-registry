import React from "react";
import NavLink from "./NavLink";

const Footer = () => {
  return (
    <div className="bg-base-200 py-6 mt-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6">
          <NavLink linkTo="/reports">Reports</NavLink>
          <NavLink linkTo="#">About</NavLink>
          <NavLink linkTo="#">Contact</NavLink>
          <NavLink linkTo="/reports">Search</NavLink>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>&copy; 2024 National Lost Pet Registry. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;