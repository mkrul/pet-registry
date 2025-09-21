import { Link } from "react-router-dom";
import { NavLinkProps } from "../../types/common/NavLink";

const NavLink = ({ linkTo, children, handler, className = "" }: NavLinkProps) => {
  const path = linkTo || "#";

  const baseClasses = "text-base focus:outline-none active:outline-none no-tap-highlight";

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
