import NavLink from "../shared/NavLink";
import { useLogoutMutation } from "../../redux/features/auth/authApiSlice";
import { useAppDispatch } from "../../redux/hooks";
import { clearUser } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationState, NotificationType } from "../../types/Notification";
import { Errors } from "../../types/ErrorMessages";

const ProfileDropdown = () => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      dispatch(clearUser());

      // Clear any remaining cookies manually
      document.cookie = "_pet_registry_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "remember_user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setNotification({
        type: NotificationType.SUCCESS,
        message: response.message
      });
      navigate("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || Errors.LOGOUT_FAILED
      });
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
