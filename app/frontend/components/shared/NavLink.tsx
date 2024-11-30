import { Link } from "react-router-dom";
import { INavLink } from "../../types/shared/NavLink";

// Reusable NavLink component to handle consistent styling
const NavLink = ({ linkTo, children, handler }: INavLink) => {
  const path = linkTo || "#";

  const renderComponent = handler ? (
    <button
      onClick={handler}
      className="text-base active:bg-transparent focus:bg-transparent hover:bg-transparent focus:outline-none active:outline-none no-tap-highlight"
    >
      {children}
    </button>
  ) : (
    <Link
      to={path}
      className="text-base active:bg-transparent focus:bg-transparent hover:bg-transparent focus:outline-none active:outline-none no-tap-highlight"
    >
      {children}
    </Link>
  );

  return renderComponent;
};

export default NavLink;
