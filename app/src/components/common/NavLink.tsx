import { Link } from "react-router-dom";
import { NavLinkProps } from "../../types/common/NavLink";

// Reusable NavLink component to handle consistent styling
const NavLink = ({ linkTo, children, handler, className = "" }: NavLinkProps) => {
  const path = linkTo || "#";

  const baseClasses = "text-base focus:outline-none active:outline-none no-tap-highlight";

  const renderComponent = handler ? (
    <button onClick={handler} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  ) : (
    <Link to={path} className={`${baseClasses} ${className}`}>
      {children}
    </Link>
  );

  return renderComponent;
};

export default NavLink;
