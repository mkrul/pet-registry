import SearchBar from "../shared/SearchBar";

import DesktopMenu from "../main/DesktopMenu";
import MobileMenu from "./MobileMenu";

const NavBar = () => {
  return (
    <div>
      <DesktopMenu />

      <MobileMenu />
    </div>
  );
};

export default NavBar;
