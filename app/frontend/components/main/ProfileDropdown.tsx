import NavLink from "../shared/NavLink";

const ProfileDropdown = () => {
  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <NavLink linkTo="/my-reports">My Reports</NavLink>
          </li>
          <li>
            <NavLink linkTo="/my-pets">My Pets</NavLink>
          </li>
          <li>
            <NavLink linkTo="/profile">
              Profile <span className="badge">New</span>
            </NavLink>
          </li>
          <li>
            <NavLink linkTo="/settings">Settings</NavLink>
          </li>
          <li>
            <NavLink linkTo="/logout">Logout</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
