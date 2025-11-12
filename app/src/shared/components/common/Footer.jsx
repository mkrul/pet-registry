import NavLink from "./NavLink";
import { useSelector } from "react-redux";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isAuthenticated = useSelector((state) => !!state.auth.user);

  return (
    <div className="bg-page dark:bg-gray-900 pt-12 pb-5" role="contentinfo" data-testid="footer">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 pb-3">
          {isAuthenticated && (
            <NavLink linkTo="/dashboard/reports?action=create">New Report</NavLink>
          )}
          <NavLink linkTo="/reports">Search</NavLink>
          <NavLink linkTo="/about">About</NavLink>
          <NavLink linkTo="/contact">Contact</NavLink>
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} Lost Pets Registry. All rights reserved.</p>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          This project runs on the generosity of others. Please consider donating to help support our work.
        </div>
      </div>
    </div>
  );
};

export default Footer;
