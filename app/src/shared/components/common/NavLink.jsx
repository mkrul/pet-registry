import { Link } from "react-router-dom";

const NavLink = ({ linkTo, children, handler, className = "" }) => {
  const path = linkTo || "#";

  const baseClasses = "text-base focus:outline-none active:outline-none no-tap-highlight text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100";

  const handleClick = () => {
    if (handler) {
      handler();
    }
  };

  return (
    <Link to={path} className={`${baseClasses} ${className}`} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavLink;
