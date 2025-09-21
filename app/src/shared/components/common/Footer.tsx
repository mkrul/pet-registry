import NavLink from "./NavLink";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);

  return (
    <div className="bg-base-200 py-6" role="contentinfo" data-testid="footer">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6">
          {isAuthenticated && (
            <NavLink linkTo="/dashboard?section=reports&action=create">New Report</NavLink>
          )}
          <NavLink linkTo="/reports">Search</NavLink>
          <NavLink linkTo="#">About</NavLink>
          <NavLink linkTo="#">Contact</NavLink>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>&copy; {currentYear} Lost Pets Registry. All rights reserved. 🇵🇸 Free Palestine.</p>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          This project depends on the generosity of others to keep it running. Please consider donating to support its continued development.
        </div>
      </div>
    </div>
  );
};

export default Footer;
