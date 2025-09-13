import NavLink from "../common/NavLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-base-200 py-6" role="contentinfo" data-testid="footer">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6">
          <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
          <NavLink linkTo="/reports">Search</NavLink>
          <NavLink linkTo="#">About</NavLink>
          <NavLink linkTo="#">Contact</NavLink>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>&copy; {currentYear} Lost Pets Registry. All rights reserved.</p>
        </div>

        <div className="mt-4 text-sm text-gray-500">🇵🇸 Free Palestine.</div>
      </div>
    </div>
  );
};

export default Footer;
