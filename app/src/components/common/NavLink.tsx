import { Link } from "react-router-dom";
import { NavLinkProps } from "../../types/common/NavLink";

const NavLink = ({ linkTo, children, handler, className = "" }: NavLinkProps) => {
  const path = linkTo || "#";

  const baseClasses = "text-base focus:outline-none active:outline-none no-tap-highlight";

  const handleClick = (e: React.MouseEvent) => {
    if (handler) {
      handler();
    }

    if (path.startsWith('/dashboard')) {
      e.preventDefault();
      window.location.href = path;
    }
  };

  if (path.startsWith('/dashboard')) {
    return (
      <a href={path} className={`${baseClasses} ${className}`} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={path} className={`${baseClasses} ${className}`} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavLink;
