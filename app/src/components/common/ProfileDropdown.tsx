import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { logout } from "../../redux/features/auth/authSlice";
import NavLink from "../shared/NavLink";

const ProfileDropdown = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink linkTo="/login">Login</NavLink>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <div className="flex items-center justify-center w-full h-full bg-primary text-white text-xl">
            {user.email[0].toUpperCase()}
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
