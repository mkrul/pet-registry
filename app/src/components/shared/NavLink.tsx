import { Link } from "react-router-dom";
import { INavLink } from "../../types/shared/NavLink";

// Reusable NavLink component to handle consistent styling
const NavLink = ({ linkTo, children, handler, className = "" }: INavLink) => {
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
