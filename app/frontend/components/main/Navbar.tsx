import SearchBar from "../shared/SearchBar";

import DesktopMenu from "../main/DesktopMenu";
import MobileMenu from "./MobileMenu";

const NavBar = () => {
  return (
    <div>
      <DesktopMenu />

      <MobileMenu />

      <div className="lg:hidden w-full px-4 mt-2">
        <SearchBar />
      </div>
    </div>
  );
};

export default NavBar;
