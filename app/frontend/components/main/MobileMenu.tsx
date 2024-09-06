import SearchBar from "../shared/SearchBar";
import NavLink from "../shared/NavLink";

const MobileMenu = () => {
  return (
    <div>
      <div className="md:hidden w-full px-4 mt-2 mb-5 text-center">
        <ul className="flex justify-center space-x-6">
          <li>
            <NavLink linkTo="/reports/new">Report a Lost Pet</NavLink>
          </li>
          <li>
            <NavLink linkTo="/about">About</NavLink>
          </li>
          <li>
            <NavLink linkTo="/contact">Contact</NavLink>
          </li>
        </ul>
      </div>

      <div className="lg:hidden w-full px-4 mt-2">
        <SearchBar />
      </div>
    </div>
  );
};

export default MobileMenu;
