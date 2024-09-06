import { Link } from "react-router-dom";
import INavLink from "../../types/shared/INavLink";

// Reusable NavLink component to handle consistent styling
const NavLink = ({ linkTo: linkTo, children: children }: INavLink) => (
  <Link
    to={linkTo}
    className="text-base active:bg-transparent focus:bg-transparent hover:bg-transparent focus:outline-none active:outline-none no-tap-highlight"
  >
    {children}
  </Link>
);

export default NavLink;
