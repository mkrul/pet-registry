import NavLink from "../shared/NavLink";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      await logout().unwrap();
      console.log("Logout successful, clearing user state...");
      dispatch(clearUser());

      // Clear any remaining cookies manually
      document.cookie = "_pet_registry_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "remember_user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      console.log("Redirecting to login page...");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the server request fails, we should still clear the local state
      dispatch(clearUser());
      navigate("/login");
    }
  };

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
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
            <NavLink>My Reports</NavLink>
          </li>
          <li>
            <NavLink>My Pets</NavLink>
          </li>
          <li>
            <NavLink>
              Profile <span className="badge">New</span>
            </NavLink>
          </li>
          <li>
            <NavLink>Settings</NavLink>
          </li>
          <li>
            <NavLink handler={handleLogout}>Logout</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
